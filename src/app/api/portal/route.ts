import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import * as M from "@/data/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    const clientsCol = await getCollection("clients");
    let clientDoc: any = null;

    if (ObjectId.isValid(id)) {
      clientDoc = await clientsCol.findOne({ _id: new ObjectId(id) });
    }
    if (!clientDoc) {
      clientDoc = await clientsCol.findOne({ id });
    }
    if (!clientDoc) {
      clientDoc = await clientsCol.findOne({ portalToken: id });
    }
    if (!clientDoc) {
      // Look by name match
      clientDoc = await clientsCol.findOne({
        name: { $regex: new RegExp(`^${id.trim()}$`, "i") },
      });
    }

    // Fallback if testing with mock data or client name
    const clientName = clientDoc?.name || (id.length > 20 ? "Sumit Kumar" : id);
    const clientPan = clientDoc?.pan || "ABCDE1234F";

    // Fetch client's deadlines / filings
    const deadlinesCol = await getCollection("deadlines");
    const dbDeadlines = await deadlinesCol
      .find({
        $or: [
          { client: clientName },
          { client: { $regex: new RegExp(clientName, "i") } },
          { client: clientPan },
        ],
      })
      .toArray();

    // If no db deadlines found, create standard sample filings for client's services
    let filings = dbDeadlines.map((d) => ({
      id: d._id?.toString() || d.id,
      task: d.task || "Compliance Filing",
      service: d.service || "GST",
      period: d.period || "2026",
      dueDate: d.dueDate || "Due soon",
      daysOverdue: Number(d.daysOverdue) || 0,
      status: d.status || "Pending",
    }));

    if (filings.length === 0) {
      filings = [
        {
          id: "f1",
          task: "GSTR-3B",
          service: "GST",
          period: "Jul 2026",
          dueDate: "20 Aug 2026 (30 days overdue)",
          daysOverdue: 30,
          status: "Overdue",
        },
        {
          id: "f2",
          task: "GSTR-1",
          service: "GST",
          period: "Aug 2026",
          dueDate: "11 Sept 2026 (8 days overdue)",
          daysOverdue: 8,
          status: "Overdue",
        },
        {
          id: "f3",
          task: "GSTR-3B",
          service: "GST",
          period: "Aug 2026",
          dueDate: "20 Sept 2026 (due tomorrow)",
          daysOverdue: 0,
          status: "Pending",
        },
        {
          id: "f4",
          task: "GSTR-1",
          service: "GST",
          period: "Sep 2026",
          dueDate: "11 Oct 2026 (in 22 days)",
          daysOverdue: 0,
          status: "Pending",
        },
        {
          id: "f5",
          task: "GSTR-3B",
          service: "GST",
          period: "Sep 2026",
          dueDate: "20 Oct 2026 (in 31 days)",
          daysOverdue: 0,
          status: "Pending",
        },
        {
          id: "f6",
          task: "ITR filing (audit case)",
          service: "ITR",
          period: "AY2026-27",
          dueDate: "31 Oct 2026 (in 42 days)",
          daysOverdue: 0,
          status: "Pending",
        },
        {
          id: "f7",
          task: "TDS return",
          service: "TDS",
          period: "Q2 FY2026-27",
          dueDate: "31 Oct 2026 (in 42 days)",
          daysOverdue: 0,
          status: "Pending",
        },
        {
          id: "f8",
          task: "GSTR-1",
          service: "GST",
          period: "Oct 2026",
          dueDate: "11 Nov 2026 (in 53 days)",
          daysOverdue: 0,
          status: "Pending",
        },
        {
          id: "f9",
          task: "GSTR-3B",
          service: "GST",
          period: "Oct 2026",
          dueDate: "20 Nov 2026 (in 62 days)",
          daysOverdue: 0,
          status: "Pending",
        },
      ];
    }

    // Fetch documents / files
    const filesCol = await getCollection("files");
    const dbFiles = await filesCol
      .find({
        $or: [
          { client: clientName },
          { client: { $regex: new RegExp(clientName, "i") } },
        ],
      })
      .toArray();

    // Fetch fees
    const feesCol = await getCollection("fees");
    const dbFees = await feesCol
      .find({
        $or: [
          { client: clientName },
          { client: { $regex: new RegExp(clientName, "i") } },
        ],
      })
      .toArray();

    return NextResponse.json({
      client: {
        id: clientDoc?._id?.toString() || clientDoc?.id || id,
        name: clientName,
        type: clientDoc?.type || "Individual",
        pan: clientPan,
        email: clientDoc?.email || `${clientName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        phone: clientDoc?.phone || "9876543210",
        services: clientDoc?.services || ["ITR", "GSTR-1", "GSTR-3B", "TDS"],
      },
      firm: {
        name: "Sthambhalliance",
        location: "New Delhi",
      },
      filings,
      documents: dbFiles.map((f) => ({
        id: f._id?.toString() || f.id,
        name: f.name,
        request: f.request || "General Document",
        url: f.url,
      })),
      fees: dbFees.map((fee) => ({
        id: fee._id?.toString() || fee.id,
        forWhat: fee.forWhat,
        amount: Number(fee.amount) || 0,
        due: fee.due,
        status: fee.status || "Invoiced",
      })),
    });
  } catch (error: any) {
    console.error("Public GET portal error:", error);
    return NextResponse.json({ error: "Failed to load client portal" }, { status: 500 });
  }
}
