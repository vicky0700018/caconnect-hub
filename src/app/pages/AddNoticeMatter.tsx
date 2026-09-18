"use client";

import { useState } from "react";
import { NOTICE_TYPES } from "@/data/mockData";
import { useStore } from "../store";
import {
  Button,
  Card,
  CardTitle,
  Field,
  PageHeader,
  Select,
  TextArea,
  TextInput,
} from "../ui";

export default function AddNoticeMatter() {
  const { clientNames, addNoticeAsync, setPage, toast } = useStore();
  const [client, setClient] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [noticeDate, setNoticeDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [amount, setAmount] = useState("0.00");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!client || !title.trim() || !type || !noticeDate) {
      setError("Client, matter title, notice type and notice date are required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).toLowerCase();
      const dateStr = new Date(noticeDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const formattedDrafted = `${dateStr}, ${timeStr}`;

      await addNoticeAsync({
        title: title.trim(),
        noticeType: type,
        client,
        drafted: formattedDrafted,
        status: "Received",
        amount: Number(amount.replace(/[, ]/g, "")) || 0,
        notes: note,
        deadline,
      });
      toast("Matter added to the notice tracker.");
      setPage("Notice Tracker");
    } catch (err) {
      console.error(err);
      toast("Failed to add notice matter", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Add notice matter"
        subtitle="Track deadlines, hearings and the complete notice lifecycle."
        actions={<Button onClick={() => setPage("Notice Tracker")}>Back</Button>}
      />

      <Card className="max-w-2xl">
        <CardTitle>Matter details</CardTitle>
        <div className="space-y-4 p-4">
          <Field label="Client" required>
            <Select
              value={client}
              onChange={setClient}
              options={clientNames}
              placeholder="Choose a client"
            />
          </Field>
          <Field label="Matter title" required>
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="FY 2025-26 scrutiny notice"
            />
          </Field>
          <Field label="Notice type" required>
            <Select
              value={type}
              onChange={setType}
              options={NOTICE_TYPES}
              placeholder="Choose type"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Notice date" required>
              <TextInput
                type="date"
                value={noticeDate}
                onChange={(e) => setNoticeDate(e.target.value)}
                placeholder="dd-mm-yyyy"
              />
            </Field>
            <Field label="Response deadline">
              <TextInput
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="dd-mm-yyyy"
              />
            </Field>
          </div>
          <Field label="Amount in dispute (₹)">
            <TextInput
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
            />
          </Field>
          <Field label="Initial note">
            <TextArea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What needs attention?"
            />
          </Field>
          {error ? <p className="text-[12px] text-danger">{error}</p> : null}
          <Button variant="primary" onClick={submit} disabled={submitting}>
            {submitting ? "Adding..." : "Add matter"}
          </Button>
        </div>
      </Card>
    </>
  );
}
