import { useState } from "react";
import { SERVICES } from "@/data/mockData";
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
  TextInput,
  EmptyState,
} from "../ui";

export default function Clients() {
  const { clients, setClients, toast } = useStore();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [service, setService] = useState("");

  const rows = clients.filter((c) => {
    const text = `${c.name} ${c.pan} ${c.gstin ?? ""}`.toLowerCase();
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
          <Button variant="primary" onClick={() => setOpen(true)}>
            + Add client
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="sm:max-w-sm sm:flex-1">
          <TextInput
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, PAN or GSTIN"
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
              <tr>
                <Th>Name</Th>
                <Th>Type</Th>
                <Th>PAN</Th>
                <Th>Services</Th>
                <Th className="text-right">…</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <Td className="font-medium text-foreground">{c.name}</Td>
                  <Td className="text-muted-foreground">{c.type}</Td>
                  <Td className="font-mono text-[12px] text-muted-foreground">{c.pan}</Td>
                  <Td className="text-muted-foreground">{c.services.join(", ") || "—"}</Td>
                  <Td className="text-right">
                    <MoreMenu
                      items={[
                        {
                          label: "Copy PAN",
                          onClick: () => toast(`${c.pan} copied to the demo clipboard.`),
                        },
                        {
                          label: "Remove client",
                          onClick: () => {
                            setClients((cs) => cs.filter((x) => x.id !== c.id));
                            toast(`${c.name} removed.`);
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

      <AddClientModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
