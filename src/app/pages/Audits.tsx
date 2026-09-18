"use client";

import { useState } from "react";
import { AUDIT_TYPES, FINANCIAL_YEARS } from "@/data/mockData";
import { useStore } from "../store";
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
  const { clientNames, audits, addAuditAsync, updateAuditProgressAsync, toast } = useStore();
  const [client, setClient] = useState("");
  const [type, setType] = useState("");
  const [fy, setFy] = useState("FY2026-27");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const openEngagement = async () => {
    if (!client || !type) {
      setError("Client and audit type are required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await addAuditAsync({
        client,
        audit: type,
        year: fy,
        done: 0,
        total: type === "GST" ? 15 : 24,
        assigned: "—",
        due: "—",
        status: "Planning",
      });
      toast(`${type} audit opened for ${client}.`);
      setClient("");
      setType("");
    } catch (err) {
      console.error(err);
      toast("Failed to open audit engagement", "error");
    } finally {
      setSubmitting(false);
    }
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
            <Button variant="primary" className="w-full" onClick={openEngagement} disabled={submitting}>
              {submitting ? "Opening..." : "Open engagement"}
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
              </tr>
            </thead>
            <tbody>
              {audits.map((a) => (
                <tr key={a.id} className="border-b border-border/70 hover:bg-surface-2/40 transition-colors">
                  <Td className="font-medium text-foreground">{a.client}</Td>
                  <Td className="text-muted-foreground">{a.audit}</Td>
                  <Td className="text-muted-foreground">{a.year}</Td>
                  <Td>
                    <ProgressBar value={a.done} total={a.total} />
                  </Td>
                  <Td className="text-muted-foreground">{a.assigned || "—"}</Td>
                  <Td className="text-muted-foreground">{a.due || "—"}</Td>
                  <Td>
                    <Badge>{a.status || "Planning"}</Badge>
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
