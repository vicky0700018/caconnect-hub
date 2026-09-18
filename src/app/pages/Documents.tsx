"use client";

import { useState } from "react";
import { Share2, XCircle, UploadCloud, ExternalLink, Trash2, FileText, Image as ImageIcon } from "lucide-react";
import { type DocRequest } from "@/data/mockData";
import { useStore } from "../store";
import { RequestDocsModal, ShareDocModal, UploadFileModal } from "../modals";
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

export default function Documents() {
  const { docRequests, removeDocRequestAsync, files, removeFileAsync, toast } = useStore();
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [tab, setTab] = useState("Requests");
  const [sharingDoc, setSharingDoc] = useState<DocRequest | null>(null);

  const awaiting = docRequests.filter((r) => r.status === "Open").length;

  const handleCancelRequest = async (id: string, clientName: string) => {
    await removeDocRequestAsync(id);
    toast(`Request for ${clientName} cancelled.`);
  };

  const handleDeleteFile = async (id: string, fileName: string) => {
    await removeFileAsync(id);
    toast(`File "${fileName}" deleted.`);
  };

  const isImageFile = (url?: string, format?: string) => {
    if (!url) return false;
    if (format && ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(format.toLowerCase())) return true;
    return url.match(/\.(jpeg|jpg|gif|png|webp)/i) !== null || url.includes("/image/upload/");
  };

  return (
    <>
      <PageHeader
        title="Documents & Files"
        subtitle={`${awaiting} document requests awaiting upload · ${files.length} files saved on Cloudinary`}
        actions={
          <div className="flex items-center gap-2">
            <Button onClick={() => setOpenUploadModal(true)}>
              <UploadCloud className="size-4 mr-1.5 inline" />
              Upload file
            </Button>
            <Button variant="primary" onClick={() => setOpenRequestModal(true)}>
              + Request documents
            </Button>
          </div>
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
                  <Th className="text-right w-28">Actions</Th>
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
                            onClick={() => handleCancelRequest(r.id, r.client)}
                            className="rounded p-1.5 text-muted-foreground hover:bg-danger-soft hover:text-danger transition-colors"
                            title="Cancel request"
                          >
                            <XCircle className="size-4" />
                          </button>
                        </div>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </TableWrap>
          ) : (
            <EmptyState
              title="No document requests yet"
              hint="Create a link your client can upload from."
              action={
                <Button variant="primary" onClick={() => setOpenRequestModal(true)}>
                  + Request documents
                </Button>
              }
            />
          )
        ) : (
          files.length ? (
            <TableWrap>
              <thead>
                <tr className="border-b border-border bg-surface">
                  <Th>File</Th>
                  <Th>Client</Th>
                  <Th>Category / Request</Th>
                  <Th>Size</Th>
                  <Th>Uploaded</Th>
                  <Th className="text-right w-24">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {files.map((f) => {
                  const isImg = isImageFile(f.url, f.format);
                  return (
                    <tr
                      key={f.id}
                      className="border-b border-border/70 hover:bg-surface-2/40 transition-colors"
                    >
                      <Td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {isImg ? (
                            <img
                              src={f.url}
                              alt={f.name}
                              className="size-8 rounded object-cover border border-border bg-surface-2 shrink-0"
                            />
                          ) : (
                            <div className="size-8 rounded bg-surface-2 border border-border flex items-center justify-center text-muted-foreground shrink-0">
                              <FileText className="size-4" />
                            </div>
                          )}
                          <div>
                            <a
                              href={f.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-foreground text-[13px] hover:text-emerald-400 hover:underline inline-flex items-center gap-1"
                            >
                              <span>{f.name}</span>
                              <ExternalLink className="size-3 text-muted-foreground" />
                            </a>
                            <p className="text-[11px] text-muted-foreground">Stored on Cloudinary</p>
                          </div>
                        </div>
                      </Td>
                      <Td className="py-3 px-4 text-muted-foreground text-[13px]">
                        {f.client || "General"}
                      </Td>
                      <Td className="py-3 px-4 text-muted-foreground text-[13px]">
                        {f.request || "Direct Upload"}
                      </Td>
                      <Td className="py-3 px-4 text-muted-foreground text-[12px] whitespace-nowrap">
                        {f.size || "—"}
                      </Td>
                      <Td className="py-3 px-4 text-muted-foreground text-[12px] whitespace-nowrap">
                        {f.uploaded || "—"}
                      </Td>
                      <Td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={f.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
                            title="Open / View on Cloudinary"
                          >
                            <ExternalLink className="size-4" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteFile(f.id, f.name)}
                            className="rounded p-1.5 text-muted-foreground hover:bg-danger-soft hover:text-danger transition-colors"
                            title="Delete file"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </TableWrap>
          ) : (
            <EmptyState
              title="No files uploaded yet"
              hint="Upload images or documents directly to Cloudinary or send a document request to your client."
              action={
                <Button variant="primary" onClick={() => setOpenUploadModal(true)}>
                  <UploadCloud className="size-4 mr-1.5 inline" />
                  Upload file now
                </Button>
              }
            />
          )
        )}
      </Card>

      <ShareDocModal
        open={!!sharingDoc}
        onClose={() => setSharingDoc(null)}
        request={sharingDoc}
      />

      <RequestDocsModal open={openRequestModal} onClose={() => setOpenRequestModal(false)} />
      <UploadFileModal open={openUploadModal} onClose={() => setOpenUploadModal(false)} />
    </>
  );
}
