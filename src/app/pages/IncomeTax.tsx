"use client";

import { useState } from "react";
import { AlertTriangle, Upload, Landmark } from "lucide-react";
import { formatINR } from "@/data/mockData";
import { useStore } from "../store";
import {
  AlertBanner,
  Button,
  Card,
  CardTitle,
  EmptyState,
  Field,
  FileInput,
  Kpi,
  PageHeader,
  Tabs,
  Td,
  TableWrap,
  Th,
} from "../ui";

export default function IncomeTax() {
  const { alerts, demands, importDemandsAsync, toast } = useStore();
  const [file, setFile] = useState("");
  const [tab, setTab] = useState("Alerts");
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);

  const unseen = alerts.filter((a) => !a.seen);
  const outstanding = demands.reduce((s, d) => s + (Number(d.amount) || 0), 0);
  const clientsWithDemands = new Set(demands.map((d) => d.client)).size;

  const importRegister = async () => {
    if (!file) {
      setError("Choose a demand register file first.");
      return;
    }
    setError("");
    setImporting(true);
    try {
      const newDemand = {
        client: file.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
        pan: "ABCDE1234F",
        ay: "AY2025-26",
        amount: 145000,
        din: "ITBA/AST/S/143(1)/2025-26/001",
        section: "143(1)",
        raised: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };
      await importDemandsAsync([newDemand]);
      toast(`${file} imported — outstanding demands refreshed.`);
      setFile("");
    } catch (err) {
      console.error(err);
      toast("Failed to import register", "error");
    } finally {
      setImporting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Income Tax status"
        subtitle="Refunds, demands and return processing across every client, with anything that changed since your last check flagged."
      />

      <div className="mb-5">
        <AlertBanner tone="info">
          Automated sync is not connected. The Income Tax Department has no public API — the
          lawful automated route is ERI registration, which a firm applies for separately. Until
          then, record what you see on the portal or import a demand register you have
          downloaded; everything below works the same either way.
        </AlertBanner>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Outstanding demand" value={formatINR(outstanding)} tone={outstanding > 0 ? "danger" : undefined} />
        <Kpi label="Clients with demands" value={clientsWithDemands} />
        <Kpi label="Refunds awaited" value={formatINR(0)} />
        <Kpi label="New demands this week" value={unseen.length} tone={unseen.length > 0 ? "warn" : undefined} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardTitle>Import a demand register</CardTitle>
          <div className="space-y-3 p-4">
            <Field
              label="Demand register"
              required
              helper="Columns: pan, assessment_year, amount, and optionally din, section, raised_on."
            >
              <FileInput fileName={file} onPick={setFile} />
            </Field>
            {error ? <p className="text-[12px] text-danger">{error}</p> : null}
            <Button
              variant="primary"
              className="w-full inline-flex items-center justify-center gap-1.5"
              onClick={importRegister}
              disabled={importing}
            >
              <Upload className="size-4" />
              {importing ? "Importing..." : "Import register"}
            </Button>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              For each PAN in the file, the register replaces that client&apos;s outstanding demands — so a demand that has
              been cleared shows up as cleared.
            </p>
          </div>
        </Card>

        <Card>
          <Tabs
            tabs={["Alerts", "Refunds", "Demands"]}
            active={tab}
            onChange={setTab}
          />
          {tab === "Alerts" ? (
            alerts.length === 0 ? (
              <EmptyState
                title="No active alerts"
                hint="All income tax intimations and processing notices will appear here."
              />
            ) : (
              <div className="divide-y divide-border">
                {alerts.map((a) => (
                  <div key={a.id} className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-surface-2/30 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[13px] font-medium text-foreground">
                          {a.client}{" "}
                          <span className="font-normal text-muted-foreground">{a.ay}</span>
                        </p>
                        <p className="text-[13px] text-muted-foreground mt-0.5">{a.text}</p>
                      </div>
                    </div>
                    <span className="whitespace-nowrap text-[12px] text-muted-foreground">
                      {a.date}
                    </span>
                  </div>
                ))}
              </div>
            )
          ) : tab === "Refunds" ? (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <div className="size-10 rounded-full bg-surface-2 border border-border/80 flex items-center justify-center text-muted-foreground mb-3">
                <Landmark className="size-5" />
              </div>
              <p className="text-sm font-medium text-foreground">No client statuses recorded</p>
              <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">
                Open a client and record their return and refund position to start tracking it here.
              </p>
            </div>
          ) : (
            demands.length === 0 ? (
              <EmptyState
                title="No demands recorded"
                hint="Import a demand register or add demand intimations from the portal."
              />
            ) : (
              <TableWrap>
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <Th>Client</Th>
                    <Th>AY</Th>
                    <Th>Section</Th>
                    <Th>Raised</Th>
                    <Th className="text-right">Amount</Th>
                  </tr>
                </thead>
                <tbody>
                  {demands.map((d) => (
                    <tr key={d.id} className="border-b border-border/70 hover:bg-surface-2/40 transition-colors">
                      <Td className="font-medium text-foreground">{d.client}</Td>
                      <Td className="text-muted-foreground">{d.ay}</Td>
                      <Td className="text-muted-foreground">{d.section}</Td>
                      <Td className="whitespace-nowrap text-muted-foreground">{d.raisedOn || d.raised}</Td>
                      <Td className="text-right font-medium text-foreground">{formatINR(d.amount)}</Td>
                    </tr>
                  ))}
                </tbody>
              </TableWrap>
            )
          )}
        </Card>
      </div>
    </>
  );
}
