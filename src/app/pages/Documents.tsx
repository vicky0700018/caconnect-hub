"use client";

import { useState } from "react";
import { Share2, XCircle } from "lucide-react";
import { type DocRequest } from "@/data/mockData";
import { useStore } from "../store";
import { RequestDocsModal, ShareDocModal } from "../modals";
import {
  Button,
  Card,
  EmptyState,
  PageHeader,
  Tabs,
  Td,
  TableWrap,
  Th,
} from "../ui";

const files = [
  {
    id: "fl1",
    name: "PAN of directors.pdf",
    client: "Tushar Kumar",
    request: "Company Registration",
    uploaded: "12 Sept 2026",
  },
];

export default function Documents() {
  const { docRequests, removeDocRequestAsync, toast } = useStore();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("Requests");
  const [sharingDoc, setSharingDoc] = useState<DocRequest | null>(null);

  const awaiting = docRequests.filter((r) => r.status === "Open").length;

  const handleCancel = async (id: string, clientName: string) => {
    await removeDocRequestAsync(id);
    toast(`Request for ${clientName} cancelled.`);
  };

  return (
    <>
      <PageHeader
        title="Documents"
        subtitle={`${awaiting} links awaiting upload`}
        actions={
          <Button variant="primary" onClick={() => setOpen(true)}>
            + Request documents
          </Button>
        }
      />

      <Tabs
        tabs={[`Requests (${docRequests.length})`, `Files (${files.length})`]}
        active={
          tab.startsWith("Requests")
            ? `Requests (${docRequests.length})`
            : `Files (${files.length})`
        }
        onChange={(t) => setTab(t.startsWith("Requests") ? "Requests" : "Files")}
      />

      <Card className="mt-4">
        {tab === "Requests" ? (
          docRequests.length ? (
            <TableWrap>
              <thead>
                <tr className="border-b border-border bg-surface">
                  <Th>Request</Th>
                  <Th>Client</Th>
                  <Th>Received</Th>
                  <Th>Expires</Th>
                  <Th>Status</Th>
                  <Th className="text-right w-24"></Th>
                </tr>
              </thead>
              <tbody>
                {docRequests.map((r) => {
                  const isCompleted = r.status === "Completed";
                  const isOpen = r.status === "Open";
                  const isExpired = r.status === "Expired";

                  return (
                    <tr
                      key={r.id}
                      className="border-b border-border/70 hover:bg-surface-2/40 transition-colors"
                    >
                      <Td className="py-3 px-4 font-medium text-foreground text-[13px]">
                        {r.title}
                      </Td>
                      <Td className="py-3 px-4 text-muted-foreground text-[13px]">
                        {r.client}
                      </Td>
                      <Td className="py-3 px-4 text-muted-foreground text-[13px]">
                        {r.received}
                      </Td>
                      <Td className="py-3 px-4 whitespace-nowrap text-muted-foreground text-[13px]">
                        {r.expires}
                      </Td>
                      <Td className="py-3 px-4">
                        {isCompleted && (
                          <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-[#0e2a1e] text-[#4ade80] border border-[#166534]/40">
                            Completed
                          </span>
                        )}
                        {isOpen && (
                          <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-[#1c212f] text-[#9ca3af] border border-[#2b3346]">
                            Open
                          </span>
                        )}
                        {isExpired && (
                          <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-[#3b1219] text-[#f87171] border border-[#991b1b]/40">
                            Expired
                          </span>
                        )}
                        {!isCompleted && !isOpen && !isExpired && (
                          <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-[#1c212f] text-[#9ca3af]">
                            {r.status}
                          </span>
                        )}
                      </Td>
                      <Td className="py-3 px-4 whitespace-nowrap text-right">
                        {!isCompleted && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSharingDoc(r)}
                              className="rounded p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
                              title="Share upload link"
                            >
                              <Share2 className="size-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCancel(r.id, r.client)}
                              className="rounded p-1.5 text-muted-foreground hover:bg-danger-soft hover:text-danger transition-colors"
                              title="Cancel request"
                            >
                              <XCircle className="size-4" />
                            </button>
                          </div>
                        )}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </TableWrap>
          ) : (
            <EmptyState
              title="No requests yet"
              hint="Create a link your client can upload from."
            />
          )
        ) : (
          <TableWrap>
            <thead>
              <tr className="border-b border-border bg-surface">
                <Th>File</Th>
                <Th>Client</Th>
                <Th>Request</Th>
                <Th>Uploaded</Th>
              </tr>
            </thead>
            <tbody>
              {files.map((f) => (
                <tr
                  key={f.id}
                  className="border-b border-border/70 hover:bg-surface-2/40 transition-colors"
                >
                  <Td className="py-3 px-4 font-medium text-foreground text-[13px]">
                    {f.name}
                  </Td>
                  <Td className="py-3 px-4 text-muted-foreground text-[13px]">
                    {f.client}
                  </Td>
                  <Td className="py-3 px-4 text-muted-foreground text-[13px]">
                    {f.request}
                  </Td>
                  <Td className="py-3 px-4 text-muted-foreground text-[13px]">
                    {f.uploaded}
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </Card>

      <ShareDocModal
        open={!!sharingDoc}
        onClose={() => setSharingDoc(null)}
        request={sharingDoc}
      />

      <RequestDocsModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
