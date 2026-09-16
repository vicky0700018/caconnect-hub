"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  const [loading, setLoading] = useState(true);

  // Real Database state (starts clean / empty if DB has 0 records)
  const [clients, setClients] = useState<M.Client[]>([]);
  const [deadlines, setDeadlines] = useState<M.Deadline[]>([]);
  const [docRequests, setDocRequests] = useState<M.DocRequest[]>([]);
  const [fees, setFees] = useState<M.Fee[]>([]);
  const [tdsReturns, setTdsReturns] = useState<M.TdsReturn[]>([]);
  const [audits, setAudits] = useState<M.Audit[]>([]);
  const [alerts, setAlerts] = useState<M.TaxAlert[]>([]);
  const [demands, setDemands] = useState<any[]>([]);
  const [estimates, setEstimates] = useState<M.AdvanceEstimate[]>([]);
  const [notices, setNotices] = useState<M.NoticeMatter[]>([]);
  const [recons, setRecons] = useState<M.Recon[]>([]);
  const [emails, setEmails] = useState<M.EmailDraft[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [bookings, setBookings] = useState<M.Booking[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((text: string, kind: Toast["kind"] = "success") => {
    const id = nextId("t");
    setToasts((t) => [...t, { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  // Fetch real data from MongoDB APIs on mount
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        clientsRes,
        deadlinesRes,
        docsRes,
        feesRes,
        tdsRes,
        auditsRes,
        incomeTaxRes,
        advanceTaxRes,
        noticesRes,
        gstRes,
        emailsRes,
        teamRes,
        marketplaceRes,
      ] = await Promise.allSettled([
        fetch("/api/clients").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/deadlines").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/documents").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/fees").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/tds-returns").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/audits").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/income-tax").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/advance-tax").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/notices").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/gst").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/client-emails").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/team").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/marketplace").then((r) => (r.ok ? r.json() : null)),
      ]);

      if (clientsRes.status === "fulfilled" && clientsRes.value?.clients) {
        setClients(clientsRes.value.clients);
      }
      if (deadlinesRes.status === "fulfilled" && deadlinesRes.value?.deadlines) {
        setDeadlines(deadlinesRes.value.deadlines);
      }
      if (docsRes.status === "fulfilled" && docsRes.value?.docRequests) {
        setDocRequests(docsRes.value.docRequests);
      }
      if (feesRes.status === "fulfilled" && feesRes.value?.fees) {
        setFees(feesRes.value.fees);
      }
      if (tdsRes.status === "fulfilled" && tdsRes.value?.tdsReturns) {
        setTdsReturns(tdsRes.value.tdsReturns);
      }
      if (auditsRes.status === "fulfilled" && auditsRes.value?.audits) {
        setAudits(auditsRes.value.audits);
      }
      if (incomeTaxRes.status === "fulfilled" && incomeTaxRes.value?.demands) {
        setDemands(incomeTaxRes.value.demands);
      }
      if (advanceTaxRes.status === "fulfilled" && advanceTaxRes.value?.estimates) {
        setEstimates(advanceTaxRes.value.estimates);
      }
      if (noticesRes.status === "fulfilled" && noticesRes.value?.notices) {
        setNotices(noticesRes.value.notices);
      }
      if (gstRes.status === "fulfilled" && gstRes.value?.recons) {
        setRecons(gstRes.value.recons);
      }
      if (emailsRes.status === "fulfilled" && emailsRes.value?.emails) {
        setEmails(emailsRes.value.emails);
      }
      if (teamRes.status === "fulfilled" && teamRes.value?.team) {
        setTeam(teamRes.value.team);
      }
      if (marketplaceRes.status === "fulfilled" && marketplaceRes.value?.bookings) {
        setBookings(marketplaceRes.value.bookings);
      }
    } catch (err) {
      console.error("Error fetching MongoDB data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Async CRUD Actions with real MongoDB persistence
  const addClientAsync = async (clientData: Omit<M.Client, "id">) => {
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });
      const data = await res.json();
      if (data.client) {
        setClients((cs) => [...cs, data.client]);
        return data.client;
      }
    } catch (e) {
      console.error("Failed to add client:", e);
    }
  };

  const removeClientAsync = async (id: string) => {
    try {
      setClients((cs) => cs.filter((c) => c.id !== id));
      await fetch(`/api/clients?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to delete client:", e);
    }
  };

  const updateClientAsync = async (id: string, updates: Partial<M.Client>) => {
    try {
      setClients((cs) => cs.map((c) => (c.id === id ? { ...c, ...updates } : c)));
      await fetch("/api/clients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
    } catch (e) {
      console.error("Failed to update client:", e);
    }
  };

  const addDeadlineAsync = async (deadlineData: any) => {
    try {
      const res = await fetch("/api/deadlines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deadlineData),
      });
      const data = await res.json();
      if (data.deadline) {
        setDeadlines((ds) => [data.deadline, ...ds]);
        return data.deadline;
      }
    } catch (e) {
      console.error("Failed to add deadline:", e);
    }
  };

  const updateDeadlineStatusAsync = async (id: string, status: string) => {
    try {
      setDeadlines((ds) => ds.map((d) => (d.id === id ? { ...d, status: status as any } : d)));
      await fetch("/api/deadlines", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } catch (e) {
      console.error("Failed to update deadline status:", e);
    }
  };

  const removeDeadlineAsync = async (id: string) => {
    try {
      setDeadlines((ds) => ds.filter((d) => d.id !== id));
      await fetch(`/api/deadlines?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to delete deadline:", e);
    }
  };

  const addDocRequestAsync = async (docData: any) => {
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docData),
      });
      const data = await res.json();
      if (data.docRequest) {
        setDocRequests((drs) => [data.docRequest, ...drs]);
        return data.docRequest;
      }
    } catch (e) {
      console.error("Failed to add doc request:", e);
    }
  };

  const removeDocRequestAsync = async (id: string) => {
    try {
      setDocRequests((drs) => drs.filter((d) => d.id !== id));
      await fetch(`/api/documents?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to delete document request:", e);
    }
  };

  const addFeeAsync = async (feeData: any) => {
    try {
      const res = await fetch("/api/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feeData),
      });
      const data = await res.json();
      if (data.fee) {
        setFees((fs) => [data.fee, ...fs]);
        return data.fee;
      }
    } catch (e) {
      console.error("Failed to log fee:", e);
    }
  };

  const updateFeeStatusAsync = async (id: string, status: string) => {
    try {
      setFees((fs) => fs.map((f) => (f.id === id ? { ...f, status: status as any } : f)));
      await fetch("/api/fees", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } catch (e) {
      console.error("Failed to update fee status:", e);
    }
  };

  const removeFeeAsync = async (id: string) => {
    try {
      setFees((fs) => fs.filter((f) => f.id !== id));
      await fetch(`/api/fees?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to delete fee:", e);
    }
  };

  const addNoticeAsync = async (noticeData: any) => {
    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noticeData),
      });
      const data = await res.json();
      if (data.notice) {
        setNotices((ns) => [data.notice, ...ns]);
        return data.notice;
      }
    } catch (e) {
      console.error("Failed to add notice:", e);
    }
  };

  const removeNoticeAsync = async (id: string) => {
    try {
      setNotices((ns) => ns.filter((n) => n.id !== id));
      await fetch(`/api/notices?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to delete notice:", e);
    }
  };

  const addTdsReturnAsync = async (returnData: any) => {
    try {
      const res = await fetch("/api/tds-returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(returnData),
      });
      const data = await res.json();
      if (data.tdsReturn) {
        setTdsReturns((rs) => [data.tdsReturn, ...rs]);
        return data.tdsReturn;
      }
    } catch (e) {
      console.error("Failed to add TDS return:", e);
    }
  };

  const updateTdsReturnStatusAsync = async (id: string, status: string, flags = 0) => {
    try {
      setTdsReturns((rs) =>
        rs.map((x) => (x.id === id ? { ...x, status: status as any, flags } : x)),
      );
      await fetch("/api/tds-returns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, flags }),
      });
    } catch (e) {
      console.error("Failed to update TDS return status:", e);
    }
  };

  const addAuditAsync = async (auditData: any) => {
    try {
      const res = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(auditData),
      });
      const data = await res.json();
      if (data.audit) {
        setAudits((as) => [data.audit, ...as]);
        return data.audit;
      }
    } catch (e) {
      console.error("Failed to add audit:", e);
    }
  };

  const updateAuditProgressAsync = async (id: string) => {
    try {
      const target = audits.find((a) => a.id === id);
      if (!target) return;
      const nextDone = Math.min(target.total, target.done + 1);
      const nextStatus = nextDone >= target.total ? "Completed" : "In Progress";
      setAudits((as) =>
        as.map((x) => (x.id === id ? { ...x, done: nextDone, status: nextStatus as any } : x)),
      );
      await fetch("/api/audits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, done: nextDone, status: nextStatus }),
      });
    } catch (e) {
      console.error("Failed to update audit progress:", e);
    }
  };

  const addDemandAsync = async (demandData: any) => {
    try {
      const res = await fetch("/api/income-tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(demandData),
      });
      const data = await res.json();
      if (data.demand) {
        setDemands((ds) => [data.demand, ...ds]);
        return data.demand;
      }
    } catch (e) {
      console.error("Failed to add demand:", e);
    }
  };

  const importDemandsAsync = async (demandsList: any[]) => {
    try {
      const res = await fetch("/api/income-tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demands: demandsList }),
      });
      if (res.ok) {
        await refreshData();
      }
    } catch (e) {
      console.error("Failed to import demands:", e);
    }
  };

  const addEstimateAsync = async (estimateData: any) => {
    try {
      const res = await fetch("/api/advance-tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(estimateData),
      });
      const data = await res.json();
      if (data.estimate) {
        setEstimates((es) => [data.estimate, ...es]);
        return data.estimate;
      }
    } catch (e) {
      console.error("Failed to add advance tax estimate:", e);
    }
  };

  const saveEmailDraftAsync = async (emailData: any) => {
    try {
      const res = await fetch("/api/client-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });
      const data = await res.json();
      if (data.email) {
        setEmails((es) => [data.email, ...es]);
        return data.email;
      }
    } catch (e) {
      console.error("Failed to save email draft:", e);
    }
  };

  const saveGstReconAsync = async (reconData: any) => {
    try {
      const res = await fetch("/api/gst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reconData),
      });
      const data = await res.json();
      if (data.recon) {
        setRecons((rs) => [data.recon, ...rs]);
        return data.recon;
      }
    } catch (e) {
      console.error("Failed to save GST recon:", e);
    }
  };

  const addTeamMemberAsync = async (memberData: any) => {
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memberData),
      });
      const data = await res.json();
      if (data.member) {
        setTeam((tm) => [...tm, data.member]);
        return data.member;
      }
    } catch (e) {
      console.error("Failed to add team member:", e);
    }
  };

  const removeTeamMemberAsync = async (id: string) => {
    try {
      setTeam((tm) => tm.filter((t) => t.id !== id));
      await fetch(`/api/team?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to delete team member:", e);
    }
  };

  const addBookingAsync = async (bookingData: any) => {
    try {
      const res = await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (data.booking) {
        setBookings((bs) => [data.booking, ...bs]);
        return data.booking;
      }
    } catch (e) {
      console.error("Failed to add booking:", e);
    }
  };

  const updateBookingStatusAsync = async (id: string, status: string) => {
    try {
      setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status: status as any } : b)));
      await fetch("/api/marketplace", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } catch (e) {
      console.error("Failed to update booking status:", e);
    }
  };

  const clientNames = useMemo(() => clients.map((c) => c.name), [clients]);

  return {
    page,
    setPage,
    loading,
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
    refreshData,
    // Real Async Backend CRUD Actions
    addClientAsync,
    updateClientAsync,
    removeClientAsync,
    addDeadlineAsync,
    updateDeadlineStatusAsync,
    removeDeadlineAsync,
    addDocRequestAsync,
    removeDocRequestAsync,
    addFeeAsync,
    updateFeeStatusAsync,
    removeFeeAsync,
    addNoticeAsync,
    removeNoticeAsync,
    addTdsReturnAsync,
    updateTdsReturnStatusAsync,
    addAuditAsync,
    updateAuditProgressAsync,
    addDemandAsync,
    importDemandsAsync,
    addEstimateAsync,
    saveEmailDraftAsync,
    saveGstReconAsync,
    addTeamMemberAsync,
    removeTeamMemberAsync,
    addBookingAsync,
    updateBookingStatusAsync,
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
