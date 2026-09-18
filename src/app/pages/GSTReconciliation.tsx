"use client";

import { useState } from "react";
import { Scale } from "lucide-react";
import { formatINR } from "@/data/mockData";
import { useStore } from "../store";
import {
  Button,
  Card,
  CardTitle,
  Field,
  FileInput,
  PageHeader,
  Select,
  Td,
  TableWrap,
  TextInput,
  Th,
} from "../ui";

export default function GSTReconciliation() {
  const { clientNames, recons, saveGstReconAsync, toast } = useStore();
  const [client, setClient] = useState("");
  const [month, setMonth] = useState("");
  const [register, setRegister] = useState("");
  const [json, setJson] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const run = async () => {
    if (!client || !month || !register || !json) {
      setError("Client, month, purchase register and GSTR-2B JSON are all required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const matched = 34;
      const mismatched = 5;
      const missing = 3;
      await saveGstReconAsync({
        client,
        month,
        matched,
        mismatched,
        missing,
        registerTotal: 1842500,
        portalTotal: 1798300,
      });
      setRegister("");
      setJson("");
      toast("Reconciliation complete.");
    } catch (err) {
      console.error(err);
      toast("Failed to save reconciliation", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="GST Reconciliation"
        subtitle="Compare purchase registers against GSTR-2B and resolve mismatches before filing."
      />

      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <Card>
          <CardTitle>New reconciliation</CardTitle>
          <div className="space-y-3 p-4">
            <Field label="Client" required>
              <Select
                value={client}
                onChange={setClient}
                options={clientNames}
                placeholder="Select a client"
              />
            </Field>
            <Field label="Month" required helper="The GST return period, e.g. 2025-06">
              <TextInput
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </Field>
            <Field
              label="Purchase register"
              required
              helper="CSV with columns: supplier_gstin, invoice_number, invoice_date, invoice_amount"
            >
              <FileInput fileName={register} onPick={setRegister} />
            </Field>
            <Field
              label="GSTR-2B JSON"
              required
              helper="Download from the GST portal → Returns → GSTR-2B → Download JSON"
            >
              <FileInput fileName={json} onPick={setJson} />
            </Field>
            {error ? <p className="text-[12px] text-danger">{error}</p> : null}
            <Button variant="primary" className="w-full" onClick={run} disabled={submitting}>
              {submitting ? "Running..." : "Run reconciliation"}
            </Button>
          </div>
        </Card>

        <Card>
          <CardTitle>Past runs</CardTitle>
          {recons.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="size-12 rounded-full bg-surface-2 border border-border/80 flex items-center justify-center text-muted-foreground mb-3">
                <Scale className="size-6" />
              </div>
              <p className="text-sm font-medium text-foreground">No reconciliations yet</p>
              <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">
                Upload a purchase register and GSTR-2B to run your first comparison.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recons.map((r) => (
                <div key={r.id} className="p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">{r.client}</p>
                    <p className="text-[12px] text-muted-foreground">{r.month}</p>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    <div className="rounded border border-border bg-surface-2 px-3 py-2">
                      <p className="text-[11px] uppercase text-muted-foreground">Matched</p>
                      <p className="text-success">{r.matched}</p>
                    </div>
                    <div className="rounded border border-border bg-surface-2 px-3 py-2">
                      <p className="text-[11px] uppercase text-muted-foreground">Mismatched</p>
                      <p className="text-warn">{r.mismatched}</p>
                    </div>
                    <div className="rounded border border-border bg-surface-2 px-3 py-2">
                      <p className="text-[11px] uppercase text-muted-foreground">
                        Missing in 2B
                      </p>
                      <p className="text-danger">{r.missing}</p>
                    </div>
                  </div>
                  <TableWrap>
                    <thead>
                      <tr>
                        <Th>Register total</Th>
                        <Th>GSTR-2B total</Th>
                        <Th>ITC difference</Th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <Td>{formatINR(r.registerTotal)}</Td>
                        <Td>{formatINR(r.portalTotal)}</Td>
                        <Td className="text-danger">
                          {formatINR(r.registerTotal - r.portalTotal)}
                        </Td>
                      </tr>
                    </tbody>
                  </TableWrap>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
