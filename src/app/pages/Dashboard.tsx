import { useState } from "react";
import { formatINR } from "@/data/mockData";
import { useStore } from "../store";
import { AddClientModal, LogFeeModal, RequestDocsModal } from "../modals";
import {
  AlertBanner,
  Badge,
  Button,
  Card,
  Kpi,
  MoreMenu,
  PageHeader,
  SectionBar,
  Td,
  TableWrap,
  Th,
} from "../ui";

export default function Dashboard() {
  const { deadlines, clients, fees, setDeadlines, setPage, toast } = useStore();
  const [modal, setModal] = useState<"" | "client" | "docs" | "fee">("");

  const overdue = deadlines.filter((d) => d.status === "Overdue");
  const inProgress = deadlines.filter((d) => d.status === "In Progress");
  const attention = [...overdue, ...inProgress].slice(0, 8);
  const feesOverdue = fees
    .filter((f) => f.status === "Overdue")
    .reduce((s, f) => s + f.amount, 0);

  const advance = (id: string, to: "In Progress" | "Filed") => {
    setDeadlines((ds) => ds.map((d) => (d.id === id ? { ...d, status: to } : d)));
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
        <AlertBanner>
          1 new demand raised this week · {formatINR(1317699.5)} outstanding across 10
          clients
        </AlertBanner>
        <AlertBanner>
          1 client short on advance tax · {formatINR(552500)} in interest exposure so far
        </AlertBanner>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Overdue filings" value={overdue.length} tone="danger" />
        <Kpi label="Due in 7 days" value={14} />
        <Kpi label="Clients" value={clients.length} />
        <Kpi label="Fees overdue" value={formatINR(feesOverdue)} tone="danger" />
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
                <Td className="text-danger whitespace-nowrap">{d.daysOverdue} days overdue</Td>
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
      </Card>

      <AddClientModal open={modal === "client"} onClose={() => setModal("")} />
      <RequestDocsModal open={modal === "docs"} onClose={() => setModal("")} />
      <LogFeeModal open={modal === "fee"} onClose={() => setModal("")} />
    </>
  );
}
