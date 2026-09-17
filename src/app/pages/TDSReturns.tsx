"use client";

import { useState } from "react";
import { FINANCIAL_YEARS, formatINR } from "@/data/mockData";
import { useStore } from "../store";
import {
  Badge,
  Card,
  EmptyState,
  Field,
  PageHeader,
  Select,
  Td,
  TableWrap,
  Th,
} from "../ui";

const TDS_FORMS_LIST = ["24Q", "26Q", "27Q", "27EQ"];

export default function TDSReturns() {
  const {
    clientNames,
    tdsReturns,
    addTdsReturnAsync,
    updateTdsReturnStatusAsync,
    removeTdsReturnAsync,
    toast,
  } = useStore();
  const [client, setClient] = useState("");
  const [fy, setFy] = useState("FY2026-27");
  const [quarter, setQuarter] = useState("");
  const [form, setForm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const quarterOptions = [
    `Q1 ${fy}`,
    `Q2 ${fy}`,
    `Q3 ${fy}`,
    `Q4 ${fy}`,
  ];

  const openReturn = async () => {
    if (!client) {
      setError("Please select a client.");
      return;
    }
    if (!quarter) {
      setError("Please select a quarter.");
      return;
    }
    if (!form) {
      setError("Please choose a form.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await addTdsReturnAsync({
        client,
        quarter,
        form,
        tdsTotal: 0,
        flags: 0,
        status: "Preparation",
      });
      toast(`${form} return opened for ${client}.`);
      setClient("");
      setQuarter("");
      setForm("");
    } catch (err) {
      console.error(err);
      toast("Failed to open return", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="TDS Returns"
        subtitle="Challans and deductees for every 24Q and 26Q, with the common filing mistakes flagged before you file."
      />

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Left Form: Open a return */}
        <div className="rounded-lg border border-border bg-surface p-5 shadow-sm">
          <h2 className="mb-4 text-[14px] font-semibold text-foreground">Open a return</h2>
          <div className="space-y-4">
            <Field label="Client" required>
              <Select
                value={client}
                onChange={setClient}
                options={clientNames}
                placeholder="Select a client"
              />
            </Field>

            <Field label="Financial year" required>
              <Select
                value={fy}
                onChange={(val) => {
                  setFy(val);
                  setQuarter("");
                }}
                options={FINANCIAL_YEARS}
              />
            </Field>

            <Field label="Quarter" required>
              <Select
                value={quarter}
                onChange={setQuarter}
                options={quarterOptions}
                placeholder="Select a quarter"
              />
            </Field>

            <Field label="Form" required helper="24Q — salary, 26Q — everything else.">
              <Select
                value={form}
                onChange={setForm}
                options={TDS_FORMS_LIST}
                placeholder="Choose a form"
              />
            </Field>

            {error ? (
              <div className="rounded border border-danger/40 bg-danger-soft px-3 py-2 text-[12px] text-danger">
                {error}
              </div>
            ) : null}

            <div className="pt-1">
              <button
                type="button"
                onClick={openReturn}
                disabled={submitting}
                className="w-full rounded bg-[#2b3145] hover:bg-[#373e56] text-foreground font-medium py-2 text-xs transition-colors shadow-sm disabled:opacity-50"
              >
                {submitting ? "Opening..." : "Open return"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: All returns */}
        <div>
          <h2 className="mb-3 text-[14px] font-semibold text-muted-foreground">All returns</h2>
          <Card>
            {tdsReturns.length ? (
              <TableWrap>
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <Th>Client</Th>
                    <Th>Quarter</Th>
                    <Th>Form</Th>
                    <Th>TDS total</Th>
                    <Th>Flags</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {tdsReturns.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-border/70 hover:bg-surface-2/40 transition-colors"
                    >
                      <Td className="py-3 px-4 font-semibold text-[13px] text-foreground">
                        {r.client}
                      </Td>
                      <Td className="py-3 px-4 text-[13px] text-muted-foreground">{r.quarter}</Td>
                      <Td className="py-3 px-4 text-[13px] text-muted-foreground">{r.form}</Td>
                      <Td className="py-3 px-4 font-medium text-[13px] text-foreground">
                        {formatINR(r.tdsTotal)}
                      </Td>
                      <Td className="py-3 px-4 text-[13px]">
                        {r.flags > 0 ? (
                          <span className="font-semibold text-danger">{r.flags}</span>
                        ) : (
                          <span className="text-success font-medium">0</span>
                        )}
                      </Td>
                      <Td className="py-3 px-4 whitespace-nowrap">
                        <Badge>{r.status}</Badge>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </TableWrap>
            ) : (
              <EmptyState
                title="No returns opened yet"
                hint="Select a client on the left and click 'Open return' to begin."
              />
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
