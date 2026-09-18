"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  UploadCloud,
  CheckCircle2,
  FileText,
  Clock,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ImageIcon,
} from "lucide-react";

interface DocItem {
  id: string;
  name: string;
  required?: boolean;
  fileUrl?: string;
  fileName?: string;
  status?: string;
}

interface DocRequestData {
  id: string;
  title: string;
  client: string;
  message?: string;
  items: DocItem[];
  expires?: string;
  status: string;
  received?: string;
}

export default function PublicUploadPage() {
  const params = useParams();
  const requestId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [docRequest, setDocRequest] = useState<DocRequestData | null>(null);
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (!requestId) return;

    async function loadRequest() {
      try {
        setLoading(true);
        const res = await fetch(`/api/documents/public?id=${encodeURIComponent(requestId)}`);
        const data = await res.json();

        if (!res.ok || !data.request) {
          setError(data.error || "Document request not found or expired.");
        } else {
          setDocRequest(data.request);
          if (data.request.status === "Completed") {
            setUploadSuccess(true);
          }
        }
      } catch (err: any) {
        console.error("Failed to load document request:", err);
        setError("Unable to connect to server. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadRequest();
  }, [requestId]);

  const handleFileUpload = async (itemId: string, file: File) => {
    if (!file || !requestId) return;

    setUploadingItemId(itemId);
    try {
      // Step 1: Upload to Cloudinary via /api/upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("requestId", requestId);
      formData.append("folder", "caconnect_client_docs");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.error || "Upload to Cloudinary failed.");
      }

      // Step 2: Attach to Document Request and save in MongoDB
      const saveRes = await fetch("/api/documents/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          itemId,
          fileName: file.name,
          fileUrl: uploadData.url,
          publicId: uploadData.publicId,
          format: uploadData.format,
          bytes: uploadData.bytes,
        }),
      });

      const saveData = await saveRes.json();
      if (!saveRes.ok) {
        throw new Error(saveData.error || "Failed to save document details.");
      }

      // Update local state
      setDocRequest((prev) => {
        if (!prev) return prev;
        const updated = prev.items.map((it) =>
          it.id === itemId
            ? { ...it, fileUrl: uploadData.url, fileName: file.name, status: "Uploaded" }
            : it,
        );
        const uploadedCount = updated.filter((x) => x.fileUrl || x.status === "Uploaded").length;
        const allDone = uploadedCount >= updated.length;
        if (allDone) setUploadSuccess(true);
        return {
          ...prev,
          items: updated,
          received: saveData.received || `${uploadedCount} of ${updated.length}`,
          status: saveData.status || (allDone ? "Completed" : "Open"),
        };
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to upload file. Please try again.");
    } finally {
      setUploadingItemId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0f17] text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="size-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-zinc-400">Loading document request...</p>
        </div>
      </div>
    );
  }

  if (error || !docRequest) {
    return (
      <div className="min-h-screen bg-[#0d0f17] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#141724] border border-red-900/40 rounded-xl p-6 text-center space-y-4">
          <div className="size-12 rounded-full bg-red-950/60 border border-red-800/50 flex items-center justify-center mx-auto text-red-400">
            <AlertCircle className="size-6" />
          </div>
          <h2 className="text-lg font-semibold text-white">Document Link Unavailable</h2>
          <p className="text-sm text-zinc-400">{error || "This link may have expired or is invalid."}</p>
        </div>
      </div>
    );
  }

  const isImage = (url?: string) => {
    if (!url) return false;
    return (
      url.match(/\.(jpeg|jpg|gif|png|webp)/i) !== null ||
      url.includes("/image/upload/")
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0c13] text-zinc-100 flex flex-col justify-between selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-[#1f2438] bg-[#111422]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
              CA
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white leading-tight">CAConnect Client Portal</h1>
              <p className="text-[11px] text-zinc-400">Sthambhalliance Chartered Accountants</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2.5 py-1 rounded-full">
            <ShieldCheck className="size-3.5" />
            <span>256-bit Secure</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl w-full mx-auto px-4 py-8 flex-1">
        {/* Request Overview Card */}
        <div className="bg-[#131627] border border-[#232840] rounded-xl p-5 sm:p-6 mb-6 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                Document Request
              </span>
              <h2 className="text-xl font-bold text-white mt-2">{docRequest.title}</h2>
              <p className="text-sm text-zinc-400 mt-1">Requested for <span className="text-white font-medium">{docRequest.client}</span></p>
            </div>
            {docRequest.expires && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-[#1a1e33] px-3 py-1.5 rounded-lg border border-[#272d4a]">
                <Clock className="size-3.5 text-zinc-400" />
                <span>Expires: {docRequest.expires}</span>
              </div>
            )}
          </div>

          {docRequest.message && (
            <div className="mt-4 pt-4 border-t border-[#232840] text-xs text-zinc-300 bg-[#0d0f1b]/60 p-3 rounded-lg border border-[#1e2338] leading-relaxed">
              <span className="text-zinc-400 block mb-1 font-medium">Message from your CA:</span>
              &ldquo;{docRequest.message}&rdquo;
            </div>
          )}
        </div>

        {/* Success Banner if all completed */}
        {uploadSuccess && (
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 mb-6 flex items-center gap-3 text-emerald-300">
            <CheckCircle2 className="size-6 text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold">All documents uploaded successfully!</p>
              <p className="text-xs text-emerald-400/80">Your Chartered Accountant has received your files securely on Cloudinary.</p>
            </div>
          </div>
        )}

        {/* Document Items List */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider text-[11px]">
            Required Documents ({docRequest.received || `0 of ${docRequest.items.length}`})
          </h3>

          {docRequest.items.map((item, idx) => {
            const isUploaded = !!item.fileUrl || item.status === "Uploaded";
            const isCurrentlyUploading = uploadingItemId === item.id;

            return (
              <div
                key={item.id || idx}
                className={`bg-[#131627] border rounded-xl p-4 sm:p-5 transition-all ${
                  isUploaded
                    ? "border-emerald-500/30 bg-emerald-950/10"
                    : "border-[#232840] hover:border-[#333a5c]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${
                        isUploaded
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-[#1c2138] text-zinc-400 border border-[#2b3354]"
                      }`}
                    >
                      {isUploaded ? (
                        <CheckCircle2 className="size-5" />
                      ) : (
                        <FileText className="size-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        {item.name}
                        {item.required && (
                          <span className="text-[10px] text-amber-400 bg-amber-950/40 border border-amber-800/40 px-1.5 py-0.2 rounded font-normal">
                            Required
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {isUploaded ? (
                          <span className="text-emerald-400 font-medium truncate inline-block max-w-[220px] sm:max-w-sm align-bottom">
                            Uploaded: {item.fileName || "Document file"}
                          </span>
                        ) : (
                          "Upload PDF, JPG, PNG or document"
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Upload Action */}
                  <div>
                    {isUploaded ? (
                      <div className="flex items-center gap-2">
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 bg-[#162130] hover:bg-[#1f2e42] border border-emerald-900/50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <span>View file</span>
                          <ExternalLink className="size-3" />
                        </a>
                        <label className="cursor-pointer inline-flex items-center text-xs text-zinc-400 hover:text-white bg-[#1a1e33] hover:bg-[#232844] border border-[#2c3254] px-3 py-1.5 rounded-lg transition-colors">
                          Re-upload
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
                            disabled={isCurrentlyUploading}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(item.id, file);
                            }}
                          />
                        </label>
                      </div>
                    ) : (
                      <label
                        className={`inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg cursor-pointer transition-all shadow-md ${
                          isCurrentlyUploading
                            ? "bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700"
                            : "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 hover:shadow-emerald-500/20"
                        }`}
                      >
                        {isCurrentlyUploading ? (
                          <>
                            <div className="size-3.5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                            <span>Uploading to Cloudinary...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="size-4" />
                            <span>Upload file</span>
                          </>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
                          disabled={isCurrentlyUploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(item.id, file);
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Cloudinary Image thumbnail preview if image */}
                {isUploaded && item.fileUrl && isImage(item.fileUrl) && (
                  <div className="mt-3 pt-3 border-t border-[#1f263d] flex items-center gap-3">
                    <img
                      src={item.fileUrl}
                      alt={item.name}
                      className="size-16 object-cover rounded-lg border border-[#2b3354] bg-[#0c0e18]"
                    />
                    <div className="text-xs text-zinc-400">
                      <p className="text-zinc-200 font-medium">Cloudinary Image Asset</p>
                      <p className="text-[11px] text-zinc-500">Stored securely on Cloudinary Cloud Storage</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1f2438] bg-[#0d0f1b] py-6 text-center text-xs text-zinc-500">
        <div className="max-w-3xl mx-auto px-4 space-y-1">
          <p>© {new Date().getFullYear()} Sthambhalliance Chartered Accountants · Powered by CAConnect Hub</p>
          <p className="text-[11px] text-zinc-600">All uploads are encrypted and saved securely via Cloudinary.</p>
        </div>
      </footer>
    </div>
  );
}
