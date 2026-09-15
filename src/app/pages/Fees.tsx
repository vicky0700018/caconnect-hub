import { useState } from "react";
import { formatINR } from "@/data/mockData";
import { useStore } from "../store";
import { LogFeeModal } from "../modals";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Kpi,
  MoreMenu,
  PageHeader,
  Tabs,
  Td,
  TableWrap,
  Th,
} from "../ui";

const TABS = ["All", "Invoiced", "Overdue", "Paid", "Draft"];

export default function Fees() {
  const { fees, setFees, toast } = useStore();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("All");

  const collected = fees.filter((f) => f.status === "Paid").reduce((s, f) => s + f.amount, 0);
  const outstanding = fees
    .filter((f) => f.status === "Invoiced" || f.status === "Overdue")
    .reduce((s, f) => s + f.amount, 0);
  const overdueList = fees.filter((f) => f.status === "Overdue");
  const rows = tab === "All" ? fees : fees.filter((f) => f.status === tab);

  return (
    <>
      <PageHeader
        title="Fees"
        subtitle="What you have billed and what has come in."
        actions={
          <Button variant="primary" onClick={() => setOpen(true)}>
            + Log fee
          </Button>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Kpi label="Collected this month" value={formatINR(collected)} tone="success" />
        <Kpi label="Outstanding" value={formatINR(outstanding)} />
        <Kpi
          label={`Overdue · ${overdueList.length}`}
          value={formatINR(overdueList.reduce((s, f) => s + f.amount, 0))}
          tone="danger"
        />
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <Card className="mt-4">
        {rows.length ? (
          <TableWrap>
            <thead>
              <tr>
                <Th>For</Th>
                <Th>Client</Th>
                <Th>Amount</Th>
                <Th>Due</Th>
                <Th>Status</Th>
                <Th className="text-right">…</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((f) => (
                <tr key={f.id}>
                  <Td>
                    <div className="font-medium text-foreground">{f.forWhat}</div>
                    <div className="text-[12px] text-muted-foreground">{f.service}</div>
                  </Td>
                  <Td className="text-muted-foreground">{f.client}</Td>
                  <Td className="whitespace-nowrap">{formatINR(f.amount)}</Td>
                  <Td className="whitespace-nowrap text-muted-foreground">{f.due || "—"}</Td>
                  <Td>
                    <Badge>{f.status}</Badge>
                  </Td>
                  <Td className="text-right">
                    <MoreMenu
                      items={[
                        {
                          label: "Mark paid",
                          onClick: () => {
                            setFees((fs) =>
                              fs.map((x) => (x.id === f.id ? { ...x, status: "Paid" } : x)),
                            );
                            toast("Fee marked as paid.");
                          },
                        },
                        {
                          label: "Delete",
                          onClick: () => {
                            setFees((fs) => fs.filter((x) => x.id !== f.id));
                            toast("Fee deleted.");
                          },
                        },
                      ]}
                    />
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        ) : (
          <EmptyState title="Nothing here" hint="No fees with this status yet." />
        )}
      </Card>

      <LogFeeModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
