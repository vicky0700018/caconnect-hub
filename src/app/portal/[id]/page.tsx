"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  FileText,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Receipt,
  Download,
} from "lucide-react";
import { formatINR } from "@/data/mockData";

interface Filing {
  id: string;
  task: string;
  service: string;
  period: string;
  dueDate: string;
  daysOverdue?: number;
  status: string;
}

interface ClientPortalData {
  client: {
    id: string;
    name: string;
    type: string;
    pan: string;
    email: string;
    phone: string;
    services: string[];
  };
  firm: {
    name: string;
    location: string;
  };
  filings: Filing[];
  documents: { id: string; name: string; request: string; url?: string }[];
  fees: { id: string; forWhat: string; amount: number; due: string; status: string }[];
}

export default function PublicClientPortalPage() {
  const params = useParams();
  const portalId = (params?.id as string) || "";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ClientPortalData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!portalId) return;

    async function loadPortal() {
      try {
        setLoading(true);
        const res = await fetch(`/api/portal?id=${encodeURIComponent(portalId)}`);
        const result = await res.json();
        if (!res.ok || result.error) {
          setError(result.error || "Portal not found or expired.");
        } else {
          setData(result);
        }
      } catch (err) {
        console.error("Failed to load portal:", err);
        setError("Unable to connect to server. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadPortal();
  }, [portalId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0c12] text-foreground flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground font-mono">Loading client portal...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0a0c12] text-foreground flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-border bg-[#141721] p-8 text-center shadow-2xl">
          <div className="size-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-4">
            <AlertCircle className="size-6" />
          </div>
          <h2 className="text-lg font-semibold text-foreground font-serif">Portal Link Not Found</h2>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            {error || "This client portal link is inactive or could not be loaded. Please contact your Chartered Accountant for an updated link."}
          </p>
        </div>
      </div>
    );
  }

  const { client, firm, filings, documents, fees } = data;

  return (
    <div className="min-h-screen bg-[#0a0c12] text-foreground py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="space-y-1 pt-2">
          <p className="text-xs text-muted-foreground font-medium">
            {firm.name} · {firm.location}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
            {client.name}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Your filings, documents and fees — updated as your CA works on them.
          </p>
        </div>

        {/* Section 1: Filings Card */}
        <div className="rounded-2xl border border-[#232736] bg-[#141721] p-5 sm:p-6 shadow-xl space-y-4">
          <div>
            <h2 className="text-base font-semibold text-foreground font-serif">Filings</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              What is due, and what has been filed.
            </p>
          </div>

          <div className="divide-y divide-[#232736]/70 border-t border-[#232736]/70 pt-1">
            {filings.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted-foreground">
                No active filings recorded at this time.
              </p>
            ) : (
              filings.map((f) => {
                const isOverdue =
                  f.status === "Overdue" ||
                  (f.daysOverdue && f.daysOverdue > 0 && f.status !== "Done" && f.status !== "Filed");

                return (
                  <div
                    key={f.id}
                    className="flex items-center justify-between gap-3 py-3.5 hover:bg-[#1c202d]/40 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-medium text-foreground">{f.task}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {f.service} · {f.period} · {f.dueDate}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {isOverdue ? (
                        <span className="rounded px-2.5 py-0.5 text-[11px] font-medium text-rose-400 bg-rose-950/40 border border-rose-800/50">
                          Overdue
                        </span>
                      ) : f.status === "Done" || f.status === "Filed" ? (
                        <span className="rounded px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/50">
                          {f.status}
                        </span>
                      ) : (
                        <span className="rounded px-2.5 py-0.5 text-[11px] font-medium text-[#94a3b8] bg-[#1a1f2e] border border-[#2b3145]">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Section 2: Documents Held */}
        {documents && documents.length > 0 && (
          <div className="rounded-2xl border border-[#232736] bg-[#141721] p-5 sm:p-6 shadow-xl space-y-4">
            <div>
              <h2 className="text-base font-semibold text-foreground font-serif">Documents</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Copies of filings, certificates, and compliance records held on file.
              </p>
            </div>

            <div className="divide-y divide-[#232736]/70 border-t border-[#232736]/70 pt-1">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between gap-3 py-3 hover:bg-[#1c202d]/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.request}</p>
                    </div>
                  </div>

                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      <Download className="size-3.5" /> Download
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Invoiced Fees */}
        {fees && fees.length > 0 && (
          <div className="rounded-2xl border border-[#232736] bg-[#141721] p-5 sm:p-6 shadow-xl space-y-4">
            <div>
              <h2 className="text-base font-semibold text-foreground font-serif">Invoiced Fees</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Billing and payment records.
              </p>
            </div>

            <div className="divide-y divide-[#232736]/70 border-t border-[#232736]/70 pt-1">
              {fees.map((fee) => (
                <div
                  key={fee.id}
                  className="flex items-center justify-between gap-3 py-3 hover:bg-[#1c202d]/40 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{fee.forWhat}</p>
                    {fee.due && (
                      <p className="text-xs text-muted-foreground mt-0.5">Due: {fee.due}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">
                      {formatINR(fee.amount)}
                    </span>
                    <span
                      className={`rounded px-2.5 py-0.5 text-[11px] font-medium border ${
                        fee.status === "Paid"
                          ? "text-emerald-400 bg-emerald-950/40 border-emerald-800/50"
                          : fee.status === "Overdue"
                          ? "text-rose-400 bg-rose-950/40 border-rose-800/50"
                          : "text-amber-400 bg-amber-950/40 border-amber-800/50"
                      }`}
                    >
                      {fee.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-4 pb-8">
          <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
            <ShieldCheck className="size-3.5 text-muted-foreground" />
            CAConnect Secure Portal · Updated automatically
          </p>
        </div>
      </div>
    </div>
  );
}
