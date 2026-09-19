"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Pencil,
  Archive,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Landmark,
  Receipt,
  Scale,
  Mail,
  ExternalLink,
  Plus,
  Share2,
  Copy,
  Check,
  MoreVertical,
  Trash2,
  EyeOff,
  Clock,
  ChevronDown,
  RotateCw,
  Power,
} from "lucide-react";
import type { Client, Deadline } from "@/data/mockData";
import { formatINR } from "@/data/mockData";
import { useStore } from "../store";
import {
  AddClientModal,
  AddDeadlineModal,
  LogFeeModal,
  RequestDocsModal,
  ShareDocModal,
} from "../modals";
import {
  Button,
  Card,
  CardTitle,
  EmptyState,
  TableWrap,
  Td,
  Th,
  MoreMenu,
} from "../ui";

export default function ClientDetail({
  client,
  onBack,
}: {
  client: Client;
  onBack: () => void;
}) {
  const {
    deadlines,
    updateDeadlineStatusAsync,
    removeDeadlineAsync,
    docRequests,
    files,
    fees,
    tdsReturns,
    demands,
    notices,
    emails,
    removeClientAsync,
    setPage,
    toast,
  } = useStore();

  const [tab, setTab] = useState<
    | "Deadlines"
    | "Documents"
    | "KYC"
    | "TDS"
    | "Income Tax"
    | "Fees"
    | "Notices"
    | "Emails"
    | "Portal"
  >("Deadlines");

  // Modal States
  const [editOpen, setEditOpen] = useState(false);
  const [addDeadlineOpen, setAddDeadlineOpen] = useState(false);
  const [requestDocsOpen, setRequestDocsOpen] = useState(false);
  const [logFeeOpen, setLogFeeOpen] = useState(false);
  const [shareDocReq, setShareDocReq] = useState<any>(null);
  const [authorisationRecorded, setAuthorisationRecorded] = useState(false);
  const [portalCopied, setPortalCopied] = useState(false);
  const [customToken, setCustomToken] = useState<string>("");
  const [isPortalActive, setIsPortalActive] = useState<boolean>(true);
  const [activeDropdownDeadlineId, setActiveDropdownDeadlineId] = useState<string | null>(null);

  // Filter client-specific items
  const clientDeadlines = deadlines.filter(
    (d) =>
      d.client.trim().toLowerCase() === client.name.trim().toLowerCase() ||
      (client.pan && d.client.trim().toLowerCase() === client.pan.trim().toLowerCase())
  );

  const overdueDeadlines = clientDeadlines.filter(
    (d) => d.status === "Overdue" || (d.daysOverdue && d.daysOverdue > 0 && (d.status as string) !== "Done" && d.status !== "Filed")
  );

  const clientDocRequests = docRequests.filter(
    (r) => r.client.trim().toLowerCase() === client.name.trim().toLowerCase()
  );

  const clientFiles = files.filter(
    (f) => f.client.trim().toLowerCase() === client.name.trim().toLowerCase()
  );

  const clientFees = fees.filter(
    (f) => f.client.trim().toLowerCase() === client.name.trim().toLowerCase()
  );

  const clientTds = tdsReturns.filter(
    (t) => t.client.trim().toLowerCase() === client.name.trim().toLowerCase()
  );

  const clientDemands = demands.filter(
    (d) =>
      d.client.trim().toLowerCase() === client.name.trim().toLowerCase() ||
      (client.pan && d.pan?.trim().toUpperCase() === client.pan.trim().toUpperCase())
  );

  const clientNotices = notices.filter(
    (n) => n.client.trim().toLowerCase() === client.name.trim().toLowerCase()
  );

  const clientEmails = emails.filter(
    (e) => e.client.trim().toLowerCase() === client.name.trim().toLowerCase()
  );

  const portalToken = customToken || client.id;
  const portalUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/portal/${portalToken}`
      : `https://caconnect.in/portal/${portalToken}`;

  const rawPhone = client.phone?.replace(/[^0-9]/g, "") || "";
  const waPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
  const waMsg = `Hi ${client.name}, you can view your compliance filing status, documents, and fees anytime using this secure link: ${portalUrl}`;
  const waUrl = waPhone
    ? `https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent(waMsg)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(waMsg)}`;

  const copyPortalLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(portalUrl);
    }
    setPortalCopied(true);
    toast("Portal magic link copied to clipboard!");
    setTimeout(() => setPortalCopied(false), 2500);
  };

  const handleArchive = async () => {
    if (window.confirm(`Are you sure you want to archive ${client.name}?`)) {
      await removeClientAsync(client.id);
      toast(`${client.name} archived.`);
      onBack();
    }
  };

  const tabsList: typeof tab[] = [
    "Deadlines",
    "Documents",
    "KYC",
    "TDS",
    "Income Tax",
    "Fees",
    "Notices",
    "Emails",
    "Portal",
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Actions */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-2 font-medium"
        >
          <ArrowLeft className="size-3.5" />
          All clients
        </button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground font-serif sm:text-2xl">
              {client.name}
            </h1>
            {/* Service & Type Badges */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="rounded bg-surface-2 border border-border px-2 py-0.5 text-[11px] font-medium text-foreground">
                {client.type || "Individual"}
              </span>
              {client.services && client.services.length > 0 ? (
                client.services.map((s) => (
                  <span
                    key={s}
                    className="rounded bg-[#1c202d] border border-[#2b3145] px-2 py-0.5 text-[11px] font-mono text-[#cbd5e1]"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="rounded bg-[#1c202d] border border-[#2b3145] px-2 py-0.5 text-[11px] font-mono text-[#cbd5e1]">
                  Other
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs"
            >
              <Pencil className="size-3.5" />
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleArchive}
              className="inline-flex items-center gap-1.5 text-xs"
            >
              <Archive className="size-3.5" />
              Archive
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Layout: 2 Columns */}
      <div className="grid gap-4 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr]">
        {/* Left Column: Details Card */}
        <div className="space-y-4">
          <Card>
            <CardTitle>Details</CardTitle>
            <div className="p-4 divide-y divide-border/60 text-xs">
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground">PAN</span>
                <span className="font-mono uppercase text-foreground font-medium">
                  {client.pan || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground">GSTIN</span>
                <span className="font-mono uppercase text-foreground">
                  {client.gstin || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground">Email</span>
                <span className="text-foreground truncate max-w-[170px]" title={client.email}>
                  {client.email || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground">Phone</span>
                <span className="text-foreground">
                  {client.phone || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground">Audit case</span>
                <span className="text-foreground">
                  {client.isAuditCase ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground">AGM date</span>
                <span className="text-foreground">
                  {client.agmDate || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground">Added</span>
                <span className="text-muted-foreground">
                  {(client as any).createdAt
                    ? new Date((client as any).createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "05 Sept 2026"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Tabbed Content Area */}
        <div className="space-y-4">
          <Card>
            {/* Tabs Bar */}
            <div className="flex items-center gap-1 overflow-x-auto border-b border-border px-3 py-2 scrollbar-none">
              {tabsList.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    tab === t
                      ? "bg-accent text-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* TAB 1: DEADLINES */}
            {tab === "Deadlines" ? (
              <div className="p-4 space-y-4">
                {overdueDeadlines.length > 0 && (
                  <p className="text-xs text-rose-500 font-medium">
                    Overdue {overdueDeadlines.length}{" "}
                    <span className="text-muted-foreground font-normal">
                      · Past the due date — deal with these first
                    </span>
                  </p>
                )}

                {clientDeadlines.length === 0 ? (
                  <EmptyState
                    title="No deadlines recorded"
                    hint="Add compliance tasks or one-off deadlines for this client."
                    action={
                      <Button size="sm" onClick={() => setAddDeadlineOpen(true)}>
                        + Add deadline
                      </Button>
                    }
                  />
                ) : (
                  <div className="divide-y divide-border/60">
                    {clientDeadlines.map((d) => {
                      const isOverdue =
                        d.status === "Overdue" ||
                        (d.daysOverdue && d.daysOverdue > 0 && (d.status as string) !== "Done" && d.status !== "Filed");

                      return (
                        <div
                          key={d.id}
                          className="flex items-center justify-between gap-3 py-3 hover:bg-surface-2/30 transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-[13px] font-medium text-foreground">
                                {d.task}
                              </p>
                              {d.service && (
                                <span className="rounded bg-surface-2 border border-border px-1.5 py-0.2 text-[10px] text-muted-foreground">
                                  {d.service}
                                </span>
                              )}
                            </div>
                            <p className="text-[11.5px] text-muted-foreground mt-0.5">
                              {isOverdue && d.daysOverdue
                                ? `${d.daysOverdue} days overdue · `
                                : ""}
                              {d.dueDate}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 relative">
                            {/* Status Badge */}
                            <span
                              className={`rounded px-2 py-0.5 text-[11px] font-medium border ${
                                (d.status as string) === "Done" || d.status === "Filed"
                                  ? "text-emerald-400 bg-emerald-950/40 border-emerald-800/50"
                                  : isOverdue
                                  ? "text-rose-400 bg-rose-950/40 border-rose-800/50"
                                  : "text-amber-400 bg-amber-950/40 border-amber-800/50"
                              }`}
                            >
                              {d.status}
                            </span>

                            {/* Quick Action Button (Done / Start) */}
                            <button
                              type="button"
                              onClick={async () => {
                                const nextStatus =
                                  (d.status as string) === "Done" || d.status === "Filed"
                                    ? "Open"
                                    : "Done";
                                await updateDeadlineStatusAsync(d.id, nextStatus);
                                toast(
                                  nextStatus === "Done"
                                    ? "Marked as done"
                                    : "Marked as pending"
                                );
                              }}
                              className="inline-flex items-center gap-1 rounded border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface-3 transition-colors cursor-pointer"
                            >
                              {(d.status as string) === "Done" || d.status === "Filed" ? (
                                <>
                                  <Check className="size-3 text-emerald-400" /> Done
                                </>
                              ) : (
                                <>
                                  <Check className="size-3 text-muted-foreground" /> Start
                                </>
                              )}
                            </button>

                            {/* Three Dots Menu Button (•••) */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveDropdownDeadlineId(
                                    activeDropdownDeadlineId === d.id ? null : d.id
                                  )
                                }
                                title="More options"
                                className="inline-flex items-center justify-center rounded border border-border bg-surface-2 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors cursor-pointer"
                              >
                                •••
                              </button>

                              {activeDropdownDeadlineId === d.id && (
                                <div className="absolute right-0 top-full mt-1 z-30 w-44 rounded-lg border border-border bg-[#141721] p-1 shadow-xl animate-in fade-in duration-100">
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      await updateDeadlineStatusAsync(d.id, "Open");
                                      setActiveDropdownDeadlineId(null);
                                      toast("Marked as pending");
                                    }}
                                    className="w-full text-left px-2.5 py-1.5 text-xs text-foreground hover:bg-surface-2 rounded transition-colors"
                                  >
                                    Mark pending
                                  </button>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      await updateDeadlineStatusAsync(d.id, "In Progress");
                                      setActiveDropdownDeadlineId(null);
                                      toast("Marked as in progress");
                                    }}
                                    className="w-full text-left px-2.5 py-1.5 text-xs text-foreground hover:bg-surface-2 rounded transition-colors"
                                  >
                                    Mark in progress
                                  </button>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      await updateDeadlineStatusAsync(d.id, "Filed");
                                      setActiveDropdownDeadlineId(null);
                                      toast("Marked as filed");
                                    }}
                                    className="w-full text-left px-2.5 py-1.5 text-xs text-foreground hover:bg-surface-2 rounded transition-colors"
                                  >
                                    Mark filed
                                  </button>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      await updateDeadlineStatusAsync(d.id, "Done");
                                      setActiveDropdownDeadlineId(null);
                                      toast("Marked as done");
                                    }}
                                    className="w-full text-left px-2.5 py-1.5 text-xs text-foreground hover:bg-surface-2 rounded transition-colors"
                                  >
                                    Mark done
                                  </button>
                                  <div className="my-1 border-t border-border" />
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      await removeDeadlineAsync(d.id);
                                      setActiveDropdownDeadlineId(null);
                                      toast("Deadline removed");
                                    }}
                                    className="w-full text-left px-2.5 py-1.5 text-xs text-rose-500 hover:bg-rose-500/10 rounded transition-colors flex items-center gap-1.5"
                                  >
                                    <Trash2 className="size-3" /> Remove
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : null}

            {/* TAB 2: DOCUMENTS */}
            {tab === "Documents" ? (
              <div className="p-4 space-y-6">
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setRequestDocsOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs"
                  >
                    <Plus className="size-3.5" />
                    Request documents
                  </Button>
                </div>

                {clientDocRequests.length === 0 && clientFiles.length === 0 ? (
                  <div className="space-y-6 py-6 text-center">
                    <div className="flex flex-col items-center justify-center p-6 border border-border/50 rounded-xl bg-surface/30">
                      <div className="size-12 rounded-full bg-surface-2 border border-border flex items-center justify-center text-muted-foreground mb-3">
                        <ExternalLink className="size-5" />
                      </div>
                      <p className="text-sm font-semibold text-foreground font-serif">
                        No document requests yet
                      </p>
                      <p className="mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">
                        Create a checklist and send your client a link — they upload from their phone, no login.
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center p-6 border border-border/50 rounded-xl bg-surface/30">
                      <div className="size-12 rounded-full bg-surface-2 border border-border flex items-center justify-center text-muted-foreground mb-3">
                        <FileText className="size-5" />
                      </div>
                      <p className="text-sm font-semibold text-foreground font-serif">
                        No documents yet
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {clientDocRequests.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between border border-border rounded-lg p-3 bg-surface-2/20"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{r.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Received {r.received} · Expires {r.expires}
                          </p>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setShareDocReq(r)}
                          className="inline-flex items-center gap-1 text-xs"
                        >
                          <Share2 className="size-3.5" />
                          Share link
                        </Button>
                      </div>
                    ))}

                    {clientFiles.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between border border-border rounded-lg p-3 bg-surface-2/20"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="size-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{f.name}</p>
                            <p className="text-xs text-muted-foreground">{f.request || "Document"}</p>
                          </div>
                        </div>
                        {f.url && (
                          <a
                            href={f.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                          >
                            View / Download <ExternalLink className="size-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* TAB 3: KYC */}
            {tab === "KYC" ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="size-12 rounded-full bg-surface-2 border border-border/80 flex items-center justify-center text-muted-foreground mb-3">
                  <ShieldCheck className="size-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground font-serif">
                  No KYC request
                </p>
                <p className="mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">
                  A KYC checklist is created automatically when you add a client. This client was added before that feature shipped.
                </p>
              </div>
            ) : null}

            {/* TAB 4: TDS */}
            {tab === "TDS" ? (
              <div className="p-4 space-y-4">
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setPage("TDS Returns");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs"
                  >
                    <Plus className="size-3.5" />
                    Open a return
                  </Button>
                </div>

                {clientTds.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-sm font-semibold text-foreground font-serif">
                      No TDS returns yet
                    </p>
                    <p className="mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">
                      Open a return for a quarter to start logging challans and deductees.
                    </p>
                  </div>
                ) : (
                  <TableWrap>
                    <thead>
                      <tr className="border-b border-border bg-surface">
                        <Th>Quarter</Th>
                        <Th>Form</Th>
                        <Th className="text-right">TDS Total</Th>
                        <Th>Status</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientTds.map((t) => (
                        <tr key={t.id} className="border-b border-border/60">
                          <Td className="font-medium text-foreground">{t.quarter}</Td>
                          <Td className="text-muted-foreground">{t.form}</Td>
                          <Td className="text-right text-foreground">{formatINR(t.tdsTotal)}</Td>
                          <Td>
                            <span className="rounded bg-surface-2 border border-border px-2 py-0.5 text-xs">
                              {t.status}
                            </span>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </TableWrap>
                )}
              </div>
            ) : null}

            {/* TAB 5: INCOME TAX */}
            {tab === "Income Tax" ? (
              <div className="p-4 space-y-5">
                {/* Authorisation Notification Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border bg-surface-2/40 p-3">
                  <div className="flex items-center gap-2.5">
                    <EyeOff className="size-4 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      {authorisationRecorded
                        ? "Authorisation is recorded on file."
                        : "No authorisation on file. Record one before tracking this client's ITD position."}
                    </span>
                  </div>
                  {!authorisationRecorded && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setAuthorisationRecorded(true);
                        toast("Authorisation recorded for ITD tracking.");
                      }}
                      className="text-xs whitespace-nowrap"
                    >
                      Record authorisation
                    </Button>
                  )}
                </div>

                {/* Assessment years subheader */}
                <div className="flex items-center justify-between pt-2">
                  <h3 className="text-sm font-semibold text-foreground">Assessment years</h3>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setPage("Income Tax")}
                    className="inline-flex items-center gap-1.5 text-xs"
                  >
                    <Plus className="size-3.5" />
                    Record status
                  </Button>
                </div>

                {clientDemands.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-sm font-semibold text-foreground font-serif">
                      Nothing recorded yet
                    </p>
                    <p className="mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">
                      Record what the portal shows for an assessment year, and changes from the next check onward are flagged automatically.
                    </p>
                  </div>
                ) : (
                  <TableWrap>
                    <thead>
                      <tr className="border-b border-border bg-surface">
                        <Th>AY</Th>
                        <Th>Section</Th>
                        <Th>Raised</Th>
                        <Th className="text-right">Amount</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientDemands.map((d) => (
                        <tr key={d.id} className="border-b border-border/60">
                          <Td className="font-medium text-foreground">{d.ay}</Td>
                          <Td className="text-muted-foreground">{d.section}</Td>
                          <Td className="text-muted-foreground">{d.raisedOn || d.raised}</Td>
                          <Td className="text-right font-medium text-foreground">
                            {formatINR(d.amount)}
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </TableWrap>
                )}
              </div>
            ) : null}

            {/* TAB 6: FEES */}
            {tab === "Fees" ? (
              <div className="p-4 space-y-4">
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setLogFeeOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs"
                  >
                    <Plus className="size-3.5" />
                    Log fee
                  </Button>
                </div>

                {clientFees.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="size-12 rounded-full bg-surface-2 border border-border/80 flex items-center justify-center text-muted-foreground mb-3">
                      <Receipt className="size-6" />
                    </div>
                    <p className="text-sm font-semibold text-foreground font-serif">
                      No fees logged
                    </p>
                    <p className="mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">
                      Track what you have billed and what has come in — the monthly view tells you where you stand.
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setLogFeeOpen(true)}
                      className="mt-4 text-xs"
                    >
                      Log your first fee
                    </Button>
                  </div>
                ) : (
                  <TableWrap>
                    <thead>
                      <tr className="border-b border-border bg-surface">
                        <Th>For what</Th>
                        <Th>Service</Th>
                        <Th>Due</Th>
                        <Th>Status</Th>
                        <Th className="text-right">Amount</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientFees.map((f) => (
                        <tr key={f.id} className="border-b border-border/60">
                          <Td className="font-medium text-foreground">{f.forWhat}</Td>
                          <Td className="text-muted-foreground">{f.service || "—"}</Td>
                          <Td className="text-muted-foreground">{f.due || "—"}</Td>
                          <Td>
                            <span
                              className={`rounded px-2 py-0.5 text-xs font-medium border ${
                                f.status === "Paid"
                                  ? "text-emerald-400 bg-emerald-950/40 border-emerald-800/50"
                                  : f.status === "Overdue"
                                  ? "text-rose-400 bg-rose-950/40 border-rose-800/50"
                                  : "text-amber-400 bg-amber-950/40 border-amber-800/50"
                              }`}
                            >
                              {f.status}
                            </span>
                          </Td>
                          <Td className="text-right font-medium text-foreground">
                            {formatINR(f.amount)}
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </TableWrap>
                )}
              </div>
            ) : null}

            {/* TAB 7: NOTICES */}
            {tab === "Notices" ? (
              <div className="p-4 space-y-4">
                {clientNotices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="size-12 rounded-full bg-surface-2 border border-border/80 flex items-center justify-center text-muted-foreground mb-3">
                      <Scale className="size-6" />
                    </div>
                    <p className="text-sm font-semibold text-foreground font-serif">
                      No notices yet
                    </p>
                    <p className="mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">
                      Paste an IT or GST notice and get a formal draft reply in under 30 seconds.
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPage("Add notice matter")}
                      className="mt-4 text-xs"
                    >
                      Draft a reply
                    </Button>
                  </div>
                ) : (
                  <TableWrap>
                    <thead>
                      <tr className="border-b border-border bg-surface">
                        <Th>Title</Th>
                        <Th>Type</Th>
                        <Th>Drafted</Th>
                        <Th>Status</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientNotices.map((n) => (
                        <tr key={n.id} className="border-b border-border/60">
                          <Td className="font-medium text-foreground">{n.title}</Td>
                          <Td className="text-muted-foreground">{n.noticeType}</Td>
                          <Td className="text-muted-foreground">{n.drafted}</Td>
                          <Td>
                            <span className="rounded bg-surface-2 border border-border px-2 py-0.5 text-xs">
                              {n.status}
                            </span>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </TableWrap>
                )}
              </div>
            ) : null}

            {/* TAB 8: EMAILS */}
            {tab === "Emails" ? (
              <div className="p-4 space-y-4">
                <div className="flex justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage("Draft a client email")}
                    className="inline-flex items-center gap-1.5 text-xs"
                  >
                    Draft an email
                  </Button>
                </div>

                {clientEmails.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="size-12 rounded-full bg-surface-2 border border-border/80 flex items-center justify-center text-muted-foreground mb-3">
                      <Mail className="size-6" />
                    </div>
                    <p className="text-sm font-semibold text-foreground font-serif">
                      No client emails yet
                    </p>
                    <p className="mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">
                      Pick a client and a topic, and let AI draft the note for you.
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPage("Draft a client email")}
                      className="mt-4 text-xs"
                    >
                      Draft an email
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {clientEmails.map((e) => (
                      <div
                        key={e.id}
                        className="rounded-lg border border-border bg-surface-2/20 p-3.5"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">{e.topic}</p>
                          <span className="text-xs text-muted-foreground">{(e as any).updated || e.createdAt}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {e.body}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* TAB 9: PORTAL */}
            {tab === "Portal" ? (
              <div className="p-5 space-y-4">
                <div className="rounded-xl border border-border/80 bg-surface-2/20 p-5 space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-foreground font-serif">Client portal</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl mt-1">
                      One permanent link {client.name} can open any time to see their filing status,
                      the documents you hold, and their invoiced fees. No login, and it updates itself
                      as you work. Drafts, notices and your internal notes are never shown.
                    </p>
                  </div>

                  {/* Input Box with Readonly URL & Copy Button */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={portalUrl}
                      className="flex-1 rounded border border-border bg-[#0d0e15] px-3 py-2 text-xs font-mono text-muted-foreground select-all focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={copyPortalLink}
                      title="Copy link"
                      className="flex items-center justify-center rounded border border-border bg-[#181b27] p-2 text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors cursor-pointer"
                    >
                      {portalCopied ? (
                        <Check className="size-4 text-emerald-400" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </button>
                  </div>

                  {/* Actions Row: Send to Client, Preview, New link, Turn off */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-3 transition-colors cursor-pointer"
                    >
                      <Share2 className="size-3.5 text-emerald-400" />
                      Send to {client.name.split(" ")[0] || client.name}
                    </a>

                    <a
                      href={portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-3 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="size-3.5" />
                      Preview
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        const newToken = "p_" + Math.random().toString(36).substring(2, 9) + Math.random().toString(36).substring(2, 9);
                        setCustomToken(newToken);
                        toast("New permanent portal link generated!");
                      }}
                      className="inline-flex items-center gap-1.5 rounded border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-3 transition-colors cursor-pointer"
                    >
                      <RotateCw className="size-3.5" />
                      New link
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const next = !isPortalActive;
                        setIsPortalActive(next);
                        if (next) {
                          toast("Portal link enabled.");
                        } else {
                          toast("Portal link turned off.", "error");
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 rounded border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                        isPortalActive
                          ? "text-rose-400 hover:bg-rose-500/10"
                          : "text-emerald-400 hover:bg-emerald-500/10"
                      }`}
                    >
                      <Power className="size-3.5" />
                      {isPortalActive ? "Turn off" : "Turn on"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[11.5px] text-muted-foreground">
                      {isPortalActive ? "Not opened yet." : "Status: Inactive (Access disabled)"}
                    </p>
                    {!isPortalActive && (
                      <span className="text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        Link Paused
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </Card>
        </div>
      </div>

      {/* Modals for Client Detail Actions */}
      <AddClientModal
        open={editOpen}
        initialClient={client}
        onClose={() => setEditOpen(false)}
      />

      <AddDeadlineModal
        open={addDeadlineOpen}
        onClose={() => setAddDeadlineOpen(false)}
      />

      <RequestDocsModal
        open={requestDocsOpen}
        onClose={() => setRequestDocsOpen(false)}
      />

      <LogFeeModal
        open={logFeeOpen}
        onClose={() => setLogFeeOpen(false)}
      />

      <ShareDocModal
        open={!!shareDocReq}
        request={shareDocReq}
        onClose={() => setShareDocReq(null)}
      />
    </div>
  );
}
