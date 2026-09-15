import { useState } from "react";
import { AUDIT_TYPES, FINANCIAL_YEARS } from "@/data/mockData";
import { nextId, useStore } from "../store";
import {
  Badge,
  Button,
  Card,
  CardTitle,
  Field,
  PageHeader,
  ProgressBar,
  Select,
  Td,
  TableWrap,
  Th,
} from "../ui";

export default function Audits() {
  const { clientNames, audits, setAudits, toast } = useStore();
  const [client, setClient] = useState("");
  const [type, setType] = useState("");
  const [fy, setFy] = useState("FY2026-27");
  const [error, setError] = useState("");

  const openEngagement = () => {
    if (!client || !type) {
      setError("Client and audit type are required.");
      return;
    }
    setError("");
    setAudits((as) => [
      {
        id: nextId("a"),
        client,
        audit: type,
        year: fy,
        done: 0,
        total: type === "GST" ? 15 : 24,
        assigned: "—",
        due: "—",
        status: "Planning",
      },
      ...as,
    ]);
    toast(`${type} audit opened for ${client}.`);
  };

  return (
    <>
      <PageHeader
        title="Audits"
        subtitle="Workpapers, evidence and sign-off for every tax, statutory and GST audit the firm is running."
      />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardTitle>Open an engagement</CardTitle>
          <div className="space-y-3 p-4">
            <Field label="Client" required>
              <Select
                value={client}
                onChange={setClient}
                options={clientNames}
                placeholder="Select a client"
              />
            </Field>
            <Field
              label="Audit type"
              required
              helper="Loads that audit's checklist into the file."
            >
              <Select
                value={type}
                onChange={setType}
                options={AUDIT_TYPES}
                placeholder="Choose an audit"
              />
            </Field>
            <Field label="Financial year" required>
              <Select value={fy} onChange={setFy} options={FINANCIAL_YEARS} />
            </Field>
            {error ? <p className="text-[12px] text-danger">{error}</p> : null}
            <Button variant="primary" className="w-full" onClick={openEngagement}>
              Open engagement
            </Button>
          </div>
        </Card>

        <Card>
          <CardTitle>All engagements</CardTitle>
          <TableWrap>
            <thead>
              <tr>
                <Th>Client</Th>
                <Th>Audit</Th>
                <Th>Year</Th>
                <Th>Progress</Th>
                <Th>Assigned</Th>
                <Th>Due</Th>
                <Th>Status</Th>
                <Th className="text-right">Action</Th>
              </tr>
            </thead>
            <tbody>
              {audits.map((a) => (
                <tr key={a.id}>
                  <Td className="font-medium text-foreground">{a.client}</Td>
                  <Td className="text-muted-foreground">{a.audit}</Td>
                  <Td className="text-muted-foreground">{a.year}</Td>
                  <Td>
                    <ProgressBar value={a.done} total={a.total} />
                  </Td>
                  <Td className="text-muted-foreground">{a.assigned}</Td>
                  <Td className="text-muted-foreground">{a.due}</Td>
                  <Td>
                    <Badge>{a.status}</Badge>
                  </Td>
                  <Td className="text-right">
                    <Button
                      size="sm"
                      onClick={() => {
                        setAudits((as) =>
                          as.map((x) =>
                            x.id === a.id
                              ? {
                                  ...x,
                                  done: Math.min(x.total, x.done + 1),
                                  status: x.done + 1 >= x.total ? "Completed" : "In Progress",
                                }
                              : x,
                          ),
                        );
                        toast("Checklist item signed off.");
                      }}
                    >
                      Sign off step
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </Card>
      </div>
    </>
  );
}
