"use client";

import { useState } from "react";
import { formatINR } from "@/data/mockData";
import { useStore } from "../store";
import { AddClientModal, LogFeeModal, RequestDocsModal } from "../modals";
import {
  AlertBanner,
  Badge,
  Button,
  Card,
  EmptyState,
  Kpi,
  MoreMenu,
  PageHeader,
  SectionBar,
  Td,
  TableWrap,
  Th,
} from "../ui";

export default function Dashboard() {
  const {
    deadlines,
    clients,
    fees,
    demands,
    estimates,
    updateDeadlineStatusAsync,
    setPage,
    toast,
  } = useStore();
  const [modal, setModal] = useState<"" | "client" | "docs" | "fee">("");

  const overdue = deadlines.filter((d) => d.status === "Overdue");
  const inProgress = deadlines.filter((d) => d.status === "In Progress");
  const attention = [...overdue, ...inProgress].slice(0, 8);
  const feesOverdue = fees
    .filter((f) => f.status === "Overdue")
    .reduce((s, f) => s + (f.amount || 0), 0);

  const now = new Date();
  const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const dueIn7Days = deadlines.filter((d) => {
    if (d.status === "Filed" || !d.dueDate) return false;
    const due = new Date(d.dueDate);
    if (isNaN(due.getTime())) return false;
    return due >= now && due <= next7Days;
  }).length;

  const demandsOutstanding = demands.reduce((s, d) => s + (Number(d.amount) || 0), 0);
  const demandClients = new Set(demands.map((d) => d.client)).size;
  const shortEstimates = estimates.filter((e) => e.status !== "OK");

  const advance = async (id: string, to: "In Progress" | "Filed") => {
    await updateDeadlineStatusAsync(id, to);
    toast(to === "Filed" ? "Marked as filed." : "Started — moved to in progress.");
  };

  return (
    <>
      <PageHeader
        title="Good morning, Sthambhalliance"
        subtitle="What needs your attention today."
        actions={
          <>
            <Button variant="primary" onClick={() => setModal("client")}>
              + Add client
            </Button>
            <Button onClick={() => setModal("docs")}>+ Request docs</Button>
            <Button onClick={() => setModal("fee")}>+ Log fee</Button>
            <Button onClick={() => setPage("Draft a client email")}>
              Draft a notice reply
            </Button>
          </>
        }
      />

      <div className="mb-5 space-y-2">
        {demands.length > 0 ? (
          <AlertBanner>
            {demands.length} new demand{demands.length > 1 ? "s" : ""} raised · {formatINR(demandsOutstanding)} outstanding across {demandClients} client{demandClients > 1 ? "s" : ""}
          </AlertBanner>
        ) : (
          <AlertBanner>
            Income tax demands register synchronized · 0 active demands pending response
          </AlertBanner>
        )}
        {shortEstimates.length > 0 ? (
          <AlertBanner>
            {shortEstimates.length} client{shortEstimates.length > 1 ? "s" : ""} short on advance tax · Review calculation in Advance Tax module
          </AlertBanner>
        ) : (
          <AlertBanner>
            Advance tax tracker active · All tracked clients currently compliant for upcoming installment
          </AlertBanner>
        )}
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Overdue filings" value={overdue.length} tone={overdue.length > 0 ? "danger" : undefined} />
        <Kpi label="Due in 7 days" value={dueIn7Days} />
        <Kpi label="Clients" value={clients.length} />
        <Kpi label="Fees overdue" value={formatINR(feesOverdue)} tone={feesOverdue > 0 ? "danger" : undefined} />
      </div>

      <Card>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Needs attention</h2>
          <button
            onClick={() => setPage("Deadlines")}
            className="text-[13px] text-muted-foreground hover:text-foreground"
          >
            View all deadlines
          </button>
        </div>
        <SectionBar>
          Overdue · {overdue.length} · Past the due date — deal with these first
        </SectionBar>
        {attention.length === 0 ? (
          <EmptyState
            title="All clear"
            hint="No overdue filings or pending tasks need urgent attention right now."
          />
        ) : (
          <TableWrap>
            <tbody>
              {attention.map((d) => (
                <tr key={d.id}>
                  <Td>
                    <div className="font-medium text-foreground">
                      {d.task} — {d.period}
                    </div>
                    <div className="text-[12px] text-muted-foreground">{d.client}</div>
                  </Td>
                  <Td className="text-danger whitespace-nowrap">
                    {d.daysOverdue > 0 ? `${d.daysOverdue} days overdue` : "Due soon"}
                  </Td>
                  <Td className="text-muted-foreground whitespace-nowrap">{d.dueDate}</Td>
                  <Td>
                    <Badge>{d.status}</Badge>
                  </Td>
                  <Td className="text-right whitespace-nowrap">
                    <Button
                      size="sm"
                      onClick={() =>
                        advance(d.id, d.status === "In Progress" ? "Filed" : "In Progress")
                      }
                    >
                      {d.status === "In Progress" ? "Mark filed" : "Start"}
                    </Button>
                    <MoreMenu
                      items={[
                        { label: "Mark filed", onClick: () => advance(d.id, "Filed") },
                        { label: "Open client", onClick: () => setPage("Clients") },
                      ]}
                    />
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </Card>

      <AddClientModal open={modal === "client"} onClose={() => setModal("")} />
      <RequestDocsModal open={modal === "docs"} onClose={() => setModal("")} />
      <LogFeeModal open={modal === "fee"} onClose={() => setModal("")} />
    </>
  );
}
