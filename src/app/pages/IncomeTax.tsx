import { useState } from "react";
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
  const { alerts, setAlerts, demands, setDemands, toast } = useStore();
  const [file, setFile] = useState("");
  const [tab, setTab] = useState("Alerts");
  const [error, setError] = useState("");

  const unseen = alerts.filter((a) => !a.seen);
  const outstanding = demands.reduce((s, d) => s + d.amount, 0);
  const clientsWithDemands = new Set(demands.map((d) => d.client)).size;

  const importRegister = () => {
    if (!file) {
      setError("Choose a demand register file first.");
      return;
    }
    setError("");
    setDemands((ds) => ds.map((d) => ({ ...d, amount: d.amount })));
    toast(`${file} imported — outstanding demands refreshed.`);
    setFile("");
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
        <Kpi label="Outstanding demand" value={formatINR(outstanding)} tone="danger" />
        <Kpi label="Clients with demands" value={clientsWithDemands} />
        <Kpi label="Refunds awaited" value={formatINR(0)} />
        <Kpi label="New demands this week" value={unseen.length} tone="warn" />
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
            <Button variant="primary" className="w-full" onClick={importRegister}>
              Import register
            </Button>
            <p className="text-[11px] text-muted-foreground">
              An imported register replaces the outstanding demands recorded for each PAN it
              contains. Other clients are left untouched.
            </p>
          </div>
        </Card>

        <Card>
          <Tabs
            tabs={[`Alerts (${unseen.length})`, "Refunds", "Demands"]}
            active={tab === "Alerts" ? `Alerts (${unseen.length})` : tab}
            onChange={(t) => setTab(t.startsWith("Alerts") ? "Alerts" : t)}
          />
          {tab === "Alerts" ? (
            <>
              <div className="divide-y divide-border">
                {alerts.map((a) => (
                  <div key={a.id} className="flex items-start justify-between gap-4 px-4 py-3">
                    <div>
                      <p className="text-[13px] font-medium text-foreground">
                        {a.client}{" "}
                        <span className="font-normal text-muted-foreground">{a.ay}</span>
                      </p>
                      <p className="text-[13px] text-muted-foreground">{a.text}</p>
                    </div>
                    <span className="whitespace-nowrap text-[12px] text-muted-foreground">
                      {a.date}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border px-4 py-3">
                <Button
                  disabled={!unseen.length}
                  onClick={() => {
                    setAlerts((as) => as.map((a) => ({ ...a, seen: true })));
                    toast("Alerts marked as seen.");
                  }}
                >
                  Mark {unseen.length} as seen
                </Button>
              </div>
            </>
          ) : tab === "Refunds" ? (
            <EmptyState
              title="No refunds awaited"
              hint="Nothing is pending issue from the department right now."
            />
          ) : (
            <TableWrap>
              <thead>
                <tr>
                  <Th>Client</Th>
                  <Th>AY</Th>
                  <Th>Section</Th>
                  <Th>Amount</Th>
                  <Th>Raised on</Th>
                </tr>
              </thead>
              <tbody>
                {demands.map((d) => (
                  <tr key={d.id}>
                    <Td className="font-medium text-foreground">{d.client}</Td>
                    <Td className="text-muted-foreground">{d.ay}</Td>
                    <Td className="text-muted-foreground">{d.section}</Td>
                    <Td className="text-danger">{formatINR(d.amount)}</Td>
                    <Td className="whitespace-nowrap text-muted-foreground">{d.raisedOn}</Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
        </Card>
      </div>
    </>
  );
}
