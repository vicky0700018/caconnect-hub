import { useState } from "react";
import { FINANCIAL_YEARS, QUARTERS, TDS_FORMS, formatINR } from "@/data/mockData";
import { nextId, useStore } from "../store";
import {
  Badge,
  Button,
  Card,
  CardTitle,
  Field,
  PageHeader,
  Select,
  Td,
  TableWrap,
  Th,
} from "../ui";

export default function TDSReturns() {
  const { clientNames, tdsReturns, setTdsReturns, toast } = useStore();
  const [client, setClient] = useState("");
  const [fy, setFy] = useState("FY2026-27");
  const [quarter, setQuarter] = useState("Q2 FY2026-27");
  const [form, setForm] = useState("24Q — Salary");
  const [error, setError] = useState("");

  const openReturn = () => {
    if (!client) {
      setError("Choose a client to open a return.");
      return;
    }
    setError("");
    setTdsReturns((rs) => [
      {
        id: nextId("t"),
        client,
        quarter,
        form: form.split(" ")[0] ?? form,
        tdsTotal: 0,
        flags: 0,
        status: "Preparation",
      },
      ...rs,
    ]);
    toast(`${form.split(" ")[0] ?? form} opened for ${client}.`);
  };

  return (
    <>
      <PageHeader
        title="TDS Returns"
        subtitle="Challans and deductees for every 24Q and 26Q, with the common filing mistakes flagged before you file."
      />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardTitle>Open a return</CardTitle>
          <div className="space-y-3 p-4">
            <Field label="Client" required>
              <Select
                value={client}
                onChange={setClient}
                options={clientNames}
                placeholder="Choose a client"
              />
            </Field>
            <Field label="Financial year" required>
              <Select value={fy} onChange={setFy} options={FINANCIAL_YEARS} />
            </Field>
            <Field label="Quarter" required>
              <Select value={quarter} onChange={setQuarter} options={QUARTERS} />
            </Field>
            <Field label="Form" required helper="24Q — salary. 26Q — everything else.">
              <Select value={form} onChange={setForm} options={TDS_FORMS} />
            </Field>
            {error ? <p className="text-[12px] text-danger">{error}</p> : null}
            <Button variant="primary" className="w-full" onClick={openReturn}>
              Open return
            </Button>
          </div>
        </Card>

        <Card>
          <CardTitle>All returns</CardTitle>
          <TableWrap>
            <thead>
              <tr>
                <Th>Client</Th>
                <Th>Quarter</Th>
                <Th>Form</Th>
                <Th>TDS total</Th>
                <Th>Flags</Th>
                <Th>Status</Th>
                <Th className="text-right">Action</Th>
              </tr>
            </thead>
            <tbody>
              {tdsReturns.map((r) => (
                <tr key={r.id}>
                  <Td className="font-medium text-foreground">{r.client}</Td>
                  <Td className="text-muted-foreground">{r.quarter}</Td>
                  <Td className="text-muted-foreground">{r.form}</Td>
                  <Td>{formatINR(r.tdsTotal)}</Td>
                  <Td className={r.flags ? "text-warn" : "text-muted-foreground"}>{r.flags}</Td>
                  <Td>
                    <Badge>{r.status}</Badge>
                  </Td>
                  <Td className="text-right">
                    {r.status !== "Filed" ? (
                      <Button
                        size="sm"
                        onClick={() => {
                          setTdsReturns((rs) =>
                            rs.map((x) => (x.id === r.id ? { ...x, status: "Filed", flags: 0 } : x)),
                          );
                          toast("Return marked as filed.");
                        }}
                      >
                        Mark filed
                      </Button>
                    ) : (
                      <span className="text-[12px] text-muted-foreground">Filed</span>
                    )}
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
