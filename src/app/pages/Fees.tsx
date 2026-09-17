"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { formatINR, type Fee } from "@/data/mockData";
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
  const { fees, updateFeeStatusAsync, removeFeeAsync, toast } = useStore();
  const [open, setOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<Fee | null>(null);
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
          <Button
            variant="primary"
            onClick={() => {
              setEditingFee(null);
              setOpen(true);
            }}
          >
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
              <tr className="border-b border-border bg-surface">
                <Th>For</Th>
                <Th>Client</Th>
                <Th>Amount</Th>
                <Th>Due</Th>
                <Th>Status</Th>
                <Th className="text-right">•••</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((f) => (
                <tr
                  key={f.id}
                  className="border-b border-border/70 hover:bg-surface-2/40 transition-colors"
                >
                  <Td className="py-3 px-4">
                    <div className="font-semibold text-foreground text-[13px]">{f.forWhat}</div>
                    {f.service ? (
                      <div className="text-[12px] text-muted-foreground mt-0.5">{f.service}</div>
                    ) : null}
                  </Td>
                  <Td className="py-3 px-4 text-[13px] text-muted-foreground">{f.client}</Td>
                  <Td className="whitespace-nowrap py-3 px-4 font-medium text-[13px] text-foreground">
                    {formatINR(f.amount)}
                  </Td>
                  <Td className="whitespace-nowrap py-3 px-4 text-[12px] text-muted-foreground">
                    {f.due || "—"}
                  </Td>
                  <Td className="whitespace-nowrap py-3 px-4">
                    <Badge>{f.status}</Badge>
                  </Td>
                  <Td className="whitespace-nowrap text-right py-3 px-4">
                    <MoreMenu
                      items={[
                        {
                          label: "Edit",
                          icon: <Pencil className="size-3.5" />,
                          onClick: () => {
                            setEditingFee(f);
                            setOpen(true);
                          },
                        },
                        {
                          label: "Mark draft",
                          onClick: async () => {
                            await updateFeeStatusAsync(f.id, "Draft");
                            toast("Fee marked as draft.");
                          },
                        },
                        {
                          label: "Mark invoiced",
                          onClick: async () => {
                            await updateFeeStatusAsync(f.id, "Invoiced");
                            toast("Fee marked as invoiced.");
                          },
                        },
                        {
                          label: "Mark paid",
                          onClick: async () => {
                            await updateFeeStatusAsync(f.id, "Paid");
                            toast("Fee marked as paid.");
                          },
                        },
                        {
                          label: "Remove",
                          danger: true,
                          divider: true,
                          icon: <Trash2 className="size-3.5 text-danger" />,
                          onClick: async () => {
                            await removeFeeAsync(f.id);
                            toast("Fee removed.");
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

      <LogFeeModal
        open={open}
        initialFee={editingFee}
        onClose={() => {
          setOpen(false);
          setEditingFee(null);
        }}
      />
    </>
  );
}
