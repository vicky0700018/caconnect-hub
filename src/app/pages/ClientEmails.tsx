"use client";

import { useState } from "react";
import { Mail, Send, Trash2, CheckCircle2, Sparkles } from "lucide-react";
import { useStore } from "../store";
import { Button, Card, PageHeader } from "../ui";

function formatEmailDate(dateStr?: string) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const formattedDate = d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const formattedTime = d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).toLowerCase();
      return `${formattedDate}, ${formattedTime}`;
    }
  } catch (e) {
    // fallback
  }
  return dateStr;
}

export default function ClientEmails() {
  const { emails, removeEmailAsync, sendEmailAsync, setPage, toast } = useStore();
  const [sendingId, setSendingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await removeEmailAsync(id);
    toast("Email record removed.");
  };

  const handleSendDraft = async (emailItem: any) => {
    setSendingId(emailItem.id);
    try {
      await sendEmailAsync({
        client: emailItem.client,
        to: emailItem.to,
        topic: emailItem.topic,
        subject: emailItem.subject,
        body: emailItem.body,
        notes: emailItem.notes,
      });
      toast(`Email sent to ${emailItem.client} successfully!`);
    } catch (err: any) {
      console.error(err);
      toast(err?.message || "Failed to send email via SMTP", "error");
    } finally {
      setSendingId(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Client Emails"
        subtitle="AI-drafted updates and reminders for your clients."
        actions={
          <Button variant="primary" onClick={() => setPage("Draft a client email")}>
            <Sparkles className="size-3.5 mr-1.5 inline" />
            Draft an email
          </Button>
        }
      />

      <Card className="mt-4">
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="size-12 rounded-full bg-surface-2 border border-border/80 flex items-center justify-center text-muted-foreground mb-3.5">
              <Mail className="size-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">No client emails yet</p>
            <p className="mt-1 max-w-sm text-[13px] text-muted-foreground mb-5">
              Pick a client and a topic, and let AI draft the note for you.
            </p>
            <Button variant="primary" onClick={() => setPage("Draft a client email")}>
              Draft an email
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {emails.map((e: any) => {
              const isSent = e.status === "Sent";
              const isSending = sendingId === e.id;

              return (
                <div key={e.id} className="p-4 sm:p-5 hover:bg-surface-2/20 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">{e.subject}</h3>
                      {isSent ? (
                        <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium bg-[#0e2a1e] text-[#4ade80] border border-[#166534]/40">
                          <CheckCircle2 className="size-3" />
                          Sent
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium bg-[#2a2412] text-[#facc15] border border-[#713f12]/40">
                          Draft
                        </span>
                      )}
                    </div>
                    <span className="text-[12px] text-muted-foreground">
                      {formatEmailDate(e.createdAt || e.sentAt)}
                    </span>
                  </div>

                  <p className="text-[12px] text-muted-foreground">
                    <span className="font-medium text-foreground">{e.client}</span>
                    {e.to ? ` (${e.to})` : ""} · <span className="text-muted-foreground">{e.topic}</span>
                  </p>

                  <div className="mt-3 bg-surface-2/40 border border-border/60 rounded-lg p-3 text-[13px] text-muted-foreground whitespace-pre-line font-sans leading-relaxed">
                    {e.body}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {!isSent && (
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={isSending}
                          onClick={() => handleSendDraft(e)}
                        >
                          <Send className="size-3 mr-1 inline" />
                          {isSending ? "Sending..." : "Send now"}
                        </Button>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(e.id)}
                    >
                      <Trash2 className="size-3 mr-1 inline" />
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </>
  );
}
