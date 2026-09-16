"use client";

import { useState } from "react";
import { FINANCIAL_YEARS, formatINR } from "@/data/mockData";
import { useStore } from "../store";
import {
  Badge,
  Button,
  Card,
  CardTitle,
  Field,
  Kpi,
  PageHeader,
  Select,
  Td,
  TableWrap,
  TextInput,
  Th,
} from "../ui";

export default function AdvanceTax() {
  const { clientNames, estimates, addEstimateAsync, toast } = useStore();
  const [client, setClient] = useState("");
  const [fy, setFy] = useState("FY2026-27");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const short = estimates.filter((e) => e.status === "Short");
  const exposure = short.reduce((s, e) => s + Math.max(0, e.estimated * 0.45 - e.paid) * 0.01 * 5, 0);

  const save = async () => {
    const value = Number(amount.replace(/[, ]/g, ""));
    if (!client || !value) {
      setError("Client and an estimated liability are required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await addEstimateAsync({
        client,
        fy,
        estimated: value,
        paid: 0,
        nextDue: "15 Dec (75%)",
        status: value > 10000 ? "Short" : "On track",
      });
      setClient("");
      setAmount("");
      toast("Estimate saved.");
    } catch (err) {
      console.error(err);
      toast("Failed to save estimate", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Advance Tax"
        subtitle="An estimate per client per year, checked against the four statutory dates — 15% by 15 Jun, 45% by 15 Sep, 75% by 15 Dec, 100% by 15 Mar."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Clients short right now" value={short.length} tone={short.length > 0 ? "danger" : undefined} />
        <Kpi
          label="Total interest exposure"
          value={formatINR(Math.round(exposure))}
          tone={exposure > 0 ? "danger" : undefined}
        />
        <Kpi label="Due within 7 days" value={0} />
        <Kpi label="Next installment, firm-wide" value="15 Dec" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <Card>
          <CardTitle>Open an estimate</CardTitle>
          <div className="space-y-3 p-4">
            <Field label="Client" required>
              <Select
                value={client}
                onChange={setClient}
                options={clientNames}
                placeholder="Select a client"
              />
            </Field>
            <Field label="Financial year" required>
              <Select value={fy} onChange={setFy} options={FINANCIAL_YEARS} />
            </Field>
            <Field
              label="Estimated tax liability for the year (₹)"
              required
              helper="After TDS/TCS already credited elsewhere — the net figure advance tax is actually computed on. Applies once this exceeds ₹10,000 (s.208)."
            >
              <TextInput
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 5,00,000"
                inputMode="numeric"
              />
            </Field>
            {error ? <p className="text-[12px] text-danger">{error}</p> : null}
            <Button variant="primary" className="w-full" onClick={save} disabled={submitting}>
              {submitting ? "Saving..." : "Save estimate"}
            </Button>
          </div>
        </Card>

        <Card>
          <CardTitle>All estimates</CardTitle>
          <TableWrap>
            <thead>
              <tr>
                <Th>Client</Th>
                <Th>FY</Th>
                <Th>Estimated</Th>
                <Th>Paid</Th>
                <Th>Next due</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {estimates.map((e) => (
                <tr key={e.id}>
                  <Td className="font-medium text-foreground">{e.client}</Td>
                  <Td className="text-muted-foreground">{e.fy}</Td>
                  <Td>{formatINR(e.estimated)}</Td>
                  <Td className="text-muted-foreground">{formatINR(e.paid)}</Td>
                  <Td className="text-muted-foreground">{e.nextDue}</Td>
                  <Td>
                    <Badge>{e.status}</Badge>
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
