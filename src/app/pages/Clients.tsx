"use client";

import { useState } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";
import { SERVICES, type Client } from "@/data/mockData";
import { useStore } from "../store";
import { AddClientModal } from "../modals";
import {
  Button,
  Card,
  MoreMenu,
  PageHeader,
  Select,
  Td,
  TableWrap,
  Th,
  EmptyState,
} from "../ui";

export default function Clients() {
  const { clients, removeClientAsync, toast } = useStore();
  const [open, setOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [q, setQ] = useState("");
  const [service, setService] = useState("");

  const rows = clients.filter((c) => {
    const text = `${c.name} ${c.pan} ${c.phone ?? ""} ${c.gstin ?? ""}`.toLowerCase();
    const matchQ = text.includes(q.trim().toLowerCase());
    const matchS = !service || c.services.includes(service);
    return matchQ && matchS;
  });

  return (
    <>
      <PageHeader
        title="Clients"
        subtitle={`${clients.length} clients`}
        actions={
          <Button
            variant="primary"
            onClick={() => {
              setEditingClient(null);
              setOpen(true);
            }}
          >
            + Add client
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, PAN or GSTIN"
            style={{ paddingLeft: "2.5rem" }}
            className="w-full rounded border border-border bg-surface-2 py-1.5 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="sm:w-48">
          <Select
            value={service}
            onChange={setService}
            options={SERVICES}
            placeholder="All services"
          />
        </div>
      </div>

      <Card>
        {rows.length === 0 ? (
          <EmptyState title="No clients match" hint="Try a different name, PAN or service." />
        ) : (
          <TableWrap>
            <thead>
              <tr className="border-b border-border bg-surface">
                <Th>Name</Th>
                <Th>Type</Th>
                <Th>PAN</Th>
                <Th>Services</Th>
                <Th className="text-right">•••</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border/70 hover:bg-surface-2/40 transition-colors"
                >
                  <Td className="py-3 px-4">
                    <div className="font-semibold text-foreground text-[13px]">{c.name}</div>
                    {c.phone ? (
                      <div className="text-[12px] text-muted-foreground mt-0.5">{c.phone}</div>
                    ) : null}
                  </Td>
                  <Td className="py-3 px-4 text-[13px] text-muted-foreground">{c.type}</Td>
                  <Td className="py-3 px-4 font-mono text-[12px] text-muted-foreground uppercase">
                    {c.pan || "—"}
                  </Td>
                  <Td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1.5">
                      {c.services && c.services.length > 0 ? (
                        c.services.map((s) => (
                          <span
                            key={s}
                            className="rounded bg-[#1c202d] border border-[#2b3145] px-2 py-0.5 text-[11px] font-mono text-[#cbd5e1]"
                          >
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </Td>
                  <Td className="whitespace-nowrap text-right py-3 px-4">
                    <MoreMenu
                      items={[
                        {
                          label: "Edit",
                          icon: <Pencil className="size-3.5" />,
                          onClick: () => {
                            setEditingClient(c);
                            setOpen(true);
                          },
                        },
                        {
                          label: "Archive",
                          danger: true,
                          divider: true,
                          icon: <Trash2 className="size-3.5 text-danger" />,
                          onClick: async () => {
                            await removeClientAsync(c.id);
                            toast(`${c.name} archived.`);
                          },
                        },
                      ]}
                    />
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </Card>

      <AddClientModal
        open={open}
        initialClient={editingClient}
        onClose={() => {
          setOpen(false);
          setEditingClient(null);
        }}
      />
    </>
  );
}
