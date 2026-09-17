import { MongoClient, Db, Collection, Document, ObjectId } from "mongodb";

import fs from "fs";
import path from "path";

const DB_NAME = "caconnect";
const LOCAL_DB_PATH = path.join(process.cwd(), ".local-db.json");

declare global {
  var _mongoClient: MongoClient | undefined;
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  var _indexesEnsured: boolean | undefined;
  var _memoryStore: Record<string, any[]> | undefined;
  var _isUsingMemoryFallback: boolean | undefined;
}

function loadLocalStore(): Record<string, any[]> {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const content = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
      if (content.trim()) {
        return JSON.parse(content);
      }
    }
  } catch (e) {
    console.warn("Failed to load local fallback DB:", e);
  }
  return {};
}

function saveLocalStore() {
  try {
    if (global._memoryStore) {
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(global._memoryStore, null, 2), "utf-8");
    }
  } catch (e) {
    console.warn("Failed to save local fallback DB:", e);
  }
}

if (!global._memoryStore) {
  global._memoryStore = loadLocalStore();
}

function getMemoryStore(collectionName: string): any[] {
  if (!global._memoryStore) {
    global._memoryStore = loadLocalStore();
  }
  if (!global._memoryStore[collectionName]) {
    global._memoryStore[collectionName] = [];
  }
  return global._memoryStore[collectionName];
}

class MemoryCursor<T> {
  private items: T[];

  constructor(items: T[]) {
    this.items = [...items];
  }

  sort(sortCriteria: Record<string, number>) {
    const keys = Object.keys(sortCriteria);
    if (keys.length === 0) return this;
    const key = keys[0];
    const order = sortCriteria[key]; // 1 for asc, -1 for desc

    this.items.sort((a: any, b: any) => {
      const valA = a[key] ?? "";
      const valB = b[key] ?? "";
      if (valA < valB) return -1 * order;
      if (valA > valB) return 1 * order;
      return 0;
    });
    return this;
  }

  async toArray(): Promise<T[]> {
    return [...this.items];
  }
}

class MemoryCollection<T extends Document = Document> {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  private matchesQuery(doc: any, query: any): boolean {
    if (!query || Object.keys(query).length === 0) return true;
    for (const key of Object.keys(query)) {
      if (key === "$or" && Array.isArray(query[key])) {
        const matchesAny = query[key].some((subQuery: any) => this.matchesQuery(doc, subQuery));
        if (!matchesAny) return false;
      } else if (key === "_id") {
        const qVal = query[key]?.toString();
        const docVal = doc._id?.toString() || doc.id?.toString();
        if (qVal !== docVal) return false;
      } else if (key === "id") {
        const qVal = query[key]?.toString();
        const docVal = doc.id?.toString() || doc._id?.toString();
        if (qVal !== docVal) return false;
      } else if (query[key] && typeof query[key] === "object" && "$in" in query[key]) {
        const inList = query[key].$in;
        if (Array.isArray(inList) && !inList.includes(doc[key])) return false;
      } else if (query[key] && typeof query[key] === "object" && "$exists" in query[key]) {
        const exists = query[key].$exists;
        const hasKey = key in doc && doc[key] !== undefined && doc[key] !== null;
        if (exists !== hasKey) return false;
      } else {
        if (doc[key] !== query[key]) return false;
      }
    }
    return true;
  }

  find(query: any = {}) {
    const store = getMemoryStore(this.name);
    const filtered = store.filter((doc) => this.matchesQuery(doc, query));
    return new MemoryCursor<T>(filtered);
  }

  async findOne(query: any): Promise<T | null> {
    const store = getMemoryStore(this.name);
    const found = store.find((doc) => this.matchesQuery(doc, query));
    return found ? ({ ...found } as T) : null;
  }

  async insertOne(doc: any): Promise<{ insertedId: ObjectId }> {
    const store = getMemoryStore(this.name);
    const id = new ObjectId();
    const newDoc = {
      _id: id,
      id: id.toString(),
      ...doc,
    };
    store.unshift(newDoc);
    saveLocalStore();
    return { insertedId: id };
  }

  async insertMany(docs: any[]): Promise<{ insertedIds: Record<number, ObjectId> }> {
    const store = getMemoryStore(this.name);
    const insertedIds: Record<number, ObjectId> = {};
    docs.forEach((doc, idx) => {
      const id = new ObjectId();
      const newDoc = {
        _id: id,
        id: id.toString(),
        ...doc,
      };
      store.unshift(newDoc);
      insertedIds[idx] = id;
    });
    saveLocalStore();
    return { insertedIds };
  }

  async updateOne(query: any, update: any): Promise<{ matchedCount: number; modifiedCount: number }> {
    const store = getMemoryStore(this.name);
    const idx = store.findIndex((doc) => this.matchesQuery(doc, query));
    if (idx === -1) return { matchedCount: 0, modifiedCount: 0 };

    const current = store[idx];
    const setFields = update.$set || update;
    store[idx] = {
      ...current,
      ...setFields,
      _id: current._id,
      id: current.id || current._id?.toString(),
    };
    saveLocalStore();
    return { matchedCount: 1, modifiedCount: 1 };
  }

  async deleteOne(query: any): Promise<{ deletedCount: number }> {
    const store = getMemoryStore(this.name);
    const idx = store.findIndex((doc) => this.matchesQuery(doc, query));
    if (idx === -1) return { deletedCount: 0 };
    store.splice(idx, 1);
    saveLocalStore();
    return { deletedCount: 1 };
  }

  async deleteMany(query: any = {}): Promise<{ deletedCount: number }> {
    const store = getMemoryStore(this.name);
    let count = 0;
    for (let i = store.length - 1; i >= 0; i--) {
      if (this.matchesQuery(store[i], query)) {
        store.splice(i, 1);
        count++;
      }
    }
    saveLocalStore();
    return { deletedCount: count };
  }

  async countDocuments(query: any = {}): Promise<number> {
    const store = getMemoryStore(this.name);
    return store.filter((doc) => this.matchesQuery(doc, query)).length;
  }

  async createIndex(): Promise<string> {
    return "index_ok";
  }
}

function getMongoUri(): string | null {
  const envUri = process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (!envUri || envUri.includes("<db_password>")) {
    return null;
  }
  return envUri;
}

export async function getClient(): Promise<MongoClient> {
  const uri = getMongoUri();
  if (!uri) {
    throw new Error("MONGODB_URI not configured or contains placeholder.");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 2000,
        connectTimeoutMS: 3000,
      });
      global._mongoClient = client;
      global._mongoClientPromise = client.connect().catch((err) => {
        global._mongoClientPromise = undefined;
        throw err;
      });
    }
    return global._mongoClientPromise;
  } else {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 3000,
    });
    return client.connect();
  }
}

export async function getDatabase(dbName = DB_NAME): Promise<Db> {
  const client = await getClient();
  return client.db(dbName);
}

export async function getCollection<T extends Document = Document>(
  collectionName: string,
): Promise<Collection<T> | MemoryCollection<T>> {
  try {
    const db = await getDatabase();
    return db.collection<T>(collectionName);
  } catch (err: any) {
    // If MongoDB credentials are not yet set or invalid, seamlessly use MemoryCollection
    if (!global._isUsingMemoryFallback) {
      global._isUsingMemoryFallback = true;
      console.warn(
        "ℹ️ MongoDB connection not established (invalid password or offline). Using active memory datastore fallback.",
      );
    }
    return new MemoryCollection<T>(collectionName) as any;
  }
}

export default getClient;
