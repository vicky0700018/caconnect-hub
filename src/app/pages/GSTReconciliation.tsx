import { useState } from "react";
import { formatINR } from "@/data/mockData";
import { nextId, useStore } from "../store";
import {
  Button,
  Card,
  CardTitle,
  EmptyState,
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
  const { clientNames, recons, setRecons, toast } = useStore();
  const [client, setClient] = useState("");
  const [month, setMonth] = useState("");
  const [register, setRegister] = useState("");
  const [json, setJson] = useState("");
  const [error, setError] = useState("");

  const run = () => {
    if (!client || !month || !register || !json) {
      setError("Client, month, purchase register and GSTR-2B JSON are all required.");
      return;
    }
    setError("");
    const matched = 34;
    const mismatched = 5;
    const missing = 3;
    setRecons((rs) => [
      {
        id: nextId("rc"),
        client,
        month,
        matched,
        mismatched,
        missing,
        registerTotal: 1842500,
        portalTotal: 1798300,
      },
      ...rs,
    ]);
    setRegister("");
    setJson("");
    toast("Reconciliation complete.");
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
            <Button variant="primary" className="w-full" onClick={run}>
              Run reconciliation
            </Button>
          </div>
        </Card>

        <Card>
          <CardTitle>Past runs</CardTitle>
          {recons.length === 0 ? (
            <EmptyState
              title="No reconciliations yet"
              hint="Upload a purchase register and GSTR-2B to run your first comparison."
            />
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
