"use client";

import { useState } from "react";
import { Mail, Send, Trash2, CheckCircle2, FileEdit } from "lucide-react";
import { useStore } from "../store";
import { Button, Card, EmptyState, PageHeader, Tabs } from "../ui";

export default function ClientEmails() {
  const { emails, removeEmailAsync, sendEmailAsync, setPage, toast } = useStore();
  const [tab, setTab] = useState("All");
  const [sendingId, setSendingId] = useState<string | null>(null);

  const sentCount = emails.filter((e: any) => e.status === "Sent").length;
  const draftCount = emails.filter((e: any) => e.status !== "Sent").length;

  const filtered = tab === "All" 
    ? emails 
    : tab === "Sent" 
      ? emails.filter((e: any) => e.status === "Sent")
      : emails.filter((e: any) => e.status !== "Sent");

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
        subtitle="AI-drafted updates, document requests, and notifications sent to your clients."
        actions={
          <Button variant="primary" onClick={() => setPage("Draft a client email")}>
            <Mail className="size-4 mr-1.5 inline" />
            + Draft new email
          </Button>
        }
      />

      <Tabs
        tabs={[`All (${emails.length})`, `Sent (${sentCount})`, `Drafts (${draftCount})`]}
        active={
          tab === "All"
            ? `All (${emails.length})`
            : tab === "Sent"
              ? `Sent (${sentCount})`
              : `Drafts (${draftCount})`
        }
        onChange={(t) =>
          setTab(t.startsWith("All") ? "All" : t.startsWith("Sent") ? "Sent" : "Drafts")
        }
      />

      <Card className="mt-4">
        {filtered.length === 0 ? (
          <EmptyState
            title={tab === "All" ? "No client emails yet" : `No ${tab.toLowerCase()} emails`}
            hint="Pick a client and a topic, and let AI draft the note for you."
            action={
              <Button variant="primary" onClick={() => setPage("Draft a client email")}>
                + Draft an email
              </Button>
            }
          />
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((e: any) => {
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
                    <span className="text-[12px] text-muted-foreground">{e.createdAt || e.sentAt}</span>
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
