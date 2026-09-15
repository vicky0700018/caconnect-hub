import { useState } from "react";
import { EMAIL_TOPICS } from "@/data/mockData";
import { nextId, useStore } from "../store";
import {
  Button,
  Card,
  CardTitle,
  EmptyState,
  Field,
  PageHeader,
  Select,
  TextArea,
  TextInput,
} from "../ui";

const template = (client: string, topic: string, notes: string) => {
  const sign = "\n\nWarm regards,\nSthambhalliance\nChartered Accountants";
  const extra = notes.trim() ? `\n\n${notes.trim()}` : "";
  switch (topic) {
    case "GST filing reminder":
      return {
        subject: `GST filing for ${client} — documents needed this week`,
        body: `Dear ${client},\n\nThis is a gentle reminder that your GSTR-1 and GSTR-3B for the current period fall due shortly. Please share the sales and purchase registers along with the bank statement so we can prepare and file on time.\n\nIf the figures are unchanged from last month, a quick confirmation is enough.${extra}${sign}`,
      };
    case "Document request follow-up":
      return {
        subject: `Following up on pending documents — ${client}`,
        body: `Dear ${client},\n\nWe are still awaiting a few documents against the request we shared with you. The upload link remains active and does not need a login.\n\nOnce these come in, we will proceed with the filing straight away.${extra}${sign}`,
      };
    case "Fee outstanding reminder":
      return {
        subject: `Invoice outstanding — ${client}`,
        body: `Dear ${client},\n\nOur records show an invoice still outstanding against the work completed for you. We would be grateful if you could arrange settlement at your convenience.\n\nDo let us know if you would like a copy of the invoice resent.${extra}${sign}`,
      };
    case "Income tax demand update":
      return {
        subject: `Income tax demand — ${client}`,
        body: `Dear ${client},\n\nA demand has been raised on your income tax account. We have reviewed the intimation and believe it can be responded to within the statutory window.\n\nWe will prepare the response and revert with a draft for your approval before submitting it on the portal.${extra}${sign}`,
      };
    default:
      return {
        subject: `Advance tax installment — ${client}`,
        body: `Dear ${client},\n\nThe next advance tax installment is approaching. Based on the estimate on record, a shortfall would attract interest under sections 234B and 234C.\n\nPlease confirm the expected income position so we can finalise the challan amount.${extra}${sign}`,
      };
  }
};

export default function DraftEmail() {
  const { clientNames, setEmails, setPage, toast } = useStore();
  const [client, setClient] = useState("");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<{ subject: string; body: string } | null>(null);

  const generate = () => {
    if (!client || !topic) {
      setError("Choose a client and a topic first.");
      return;
    }
    setError("");
    setDraft(template(client, topic, notes));
    toast("Draft ready.");
  };

  const save = () => {
    if (!draft) return;
    setEmails((es) => [
      {
        id: nextId("em"),
        client,
        topic,
        subject: draft.subject,
        body: draft.body,
        createdAt: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      },
      ...es,
    ]);
    toast("Saved to client emails.");
    setPage("Client Emails");
  };

  return (
    <>
      <PageHeader
        title="Draft a client email"
        subtitle="Pick a client and a topic — the facts come from your own records."
        actions={<Button onClick={() => setPage("Client Emails")}>Back</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <Card>
          <CardTitle>Details</CardTitle>
          <div className="space-y-3 p-4">
            <Field label="Client" required>
              <Select
                value={client}
                onChange={setClient}
                options={clientNames}
                placeholder="Choose a client"
              />
            </Field>
            <Field label="Topic" required>
              <Select
                value={topic}
                onChange={setTopic}
                options={EMAIL_TOPICS}
                placeholder="Choose a topic"
                disabled={!client}
              />
            </Field>
            <Field label="Additional notes (optional)">
              <TextArea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention that the due date was recently extended..."
              />
            </Field>
            {error ? <p className="text-[12px] text-danger">{error}</p> : null}
            <Button variant="primary" className="w-full" onClick={generate}>
              Draft email
            </Button>
          </div>
        </Card>

        <Card>
          <CardTitle>Draft</CardTitle>
          {!draft ? (
            <EmptyState
              title="Your draft will appear here"
              hint="Pick a client and a topic, then hit Draft email."
            />
          ) : (
            <div className="space-y-3 p-4">
              <Field label="Subject">
                <TextInput
                  value={draft.subject}
                  onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                />
              </Field>
              <Field label="Message">
                <TextArea
                  rows={14}
                  value={draft.body}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                />
              </Field>
              <div className="flex gap-2">
                <Button variant="primary" onClick={save}>
                  Save draft
                </Button>
                <Button onClick={() => toast("Copied to the demo clipboard.")}>Copy</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
