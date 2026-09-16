"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as M from "@/data/mockData";

export type Page =
  | "Dashboard"
  | "Clients"
  | "Deadlines"
  | "Documents"
  | "Fees"
  | "TDS Returns"
  | "Audits"
  | "Income Tax"
  | "Advance Tax"
  | "Notice Tracker"
  | "GST Reconciliation"
  | "Client Emails"
  | "Team"
  | "Marketplace"
  | "Add notice matter"
  | "Draft a client email";

export const NAV: Page[] = [
  "Dashboard",
  "Clients",
  "Deadlines",
  "Documents",
  "Fees",
  "TDS Returns",
  "Audits",
  "Income Tax",
  "Advance Tax",
  "Notice Tracker",
  "GST Reconciliation",
  "Client Emails",
  "Team",
  "Marketplace",
];

let counter = 1000;
export const nextId = (prefix: string) => `${prefix}${++counter}`;

type Toast = { id: string; text: string; kind: "success" | "error" };

function useStoreValue() {
  const [page, setPage] = useState<Page>("Dashboard");
  const [clients, setClients] = useState<M.Client[]>(M.clients);
  const [deadlines, setDeadlines] = useState<M.Deadline[]>(M.deadlines);
  const [docRequests, setDocRequests] = useState<M.DocRequest[]>(M.docRequests);
  const [fees, setFees] = useState<M.Fee[]>(M.fees);
  const [tdsReturns, setTdsReturns] = useState<M.TdsReturn[]>(M.tdsReturns);
  const [audits, setAudits] = useState<M.Audit[]>(M.audits);
  const [alerts, setAlerts] = useState<M.TaxAlert[]>(M.taxAlerts);
  const [demands, setDemands] = useState(M.demands);
  const [estimates, setEstimates] = useState<M.AdvanceEstimate[]>(M.advanceEstimates);
  const [notices, setNotices] = useState<M.NoticeMatter[]>(M.noticeMatters);
  const [recons, setRecons] = useState<M.Recon[]>([]);
  const [emails, setEmails] = useState<M.EmailDraft[]>([]);
  const [team, setTeam] = useState(M.team);
  const [invitations, setInvitations] = useState(M.invitations);
  const [bookings, setBookings] = useState<M.Booking[]>(M.bookings);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((text: string, kind: Toast["kind"] = "success") => {
    const id = nextId("t");
    setToasts((t) => [...t, { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const clientNames = useMemo(() => clients.map((c) => c.name), [clients]);

  return {
    page,
    setPage,
    clients,
    setClients,
    clientNames,
    deadlines,
    setDeadlines,
    docRequests,
    setDocRequests,
    fees,
    setFees,
    tdsReturns,
    setTdsReturns,
    audits,
    setAudits,
    alerts,
    setAlerts,
    demands,
    setDemands,
    estimates,
    setEstimates,
    notices,
    setNotices,
    recons,
    setRecons,
    emails,
    setEmails,
    team,
    setTeam,
    invitations,
    setInvitations,
    bookings,
    setBookings,
    toasts,
    toast,
  };
}

type Store = ReturnType<typeof useStoreValue>;

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const value = useStoreValue();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
