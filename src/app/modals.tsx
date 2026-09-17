"use client";

import { useState, useEffect } from "react";
import { X, MessageCircle, Copy, Check } from "lucide-react";
import * as M from "@/data/mockData";
import { nextId, useStore } from "./store";
import {
  Button,
  CheckboxCard,
  Checkbox,
  Field,
  Modal,
  Select,
  TextArea,
  TextInput,
} from "./ui";

const todayLabel = () =>
  new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/* ---------------- Add client ---------------- */

export function AddClientModal({
  open,
  onClose,
  initialClient,
}: {
  open: boolean;
  onClose: () => void;
  initialClient?: M.Client | null;
}) {
  const { addClientAsync, updateClientAsync, toast } = useStore();
  const [name, setName] = useState("");
  const [type, setType] = useState(M.CLIENT_TYPES[0] as string);
  const [kyc, setKyc] = useState("");
  const [pan, setPan] = useState("");
  const [gstin, setGstin] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialClient) {
      setName(initialClient.name || "");
      setType(initialClient.type || (M.CLIENT_TYPES[0] as string));
      setKyc(initialClient.kycEntityType || "");
      setPan(initialClient.pan || "");
      setGstin(initialClient.gstin || "");
      setEmail(initialClient.email || "");
      setPhone(initialClient.phone || "");
      setServices(initialClient.services || []);
      setNotes(initialClient.notes || "");
      setError("");
    } else {
      setName("");
      setType(M.CLIENT_TYPES[0] as string);
      setKyc("");
      setPan("");
      setGstin("");
      setEmail("");
      setPhone("");
      setServices([]);
      setNotes("");
      setError("");
    }
  }, [initialClient, open]);

  const submit = async () => {
    if (!name.trim()) {
      setError("Client name is required.");
      return;
    }
    setSubmitting(true);
    try {
      if (initialClient) {
        await updateClientAsync(initialClient.id, {
          name: name.trim(),
          type,
          kycEntityType: kyc || initialClient.kycEntityType || "Individual / Proprietor",
          pan: pan.trim().toUpperCase(),
          gstin: gstin.trim().toUpperCase(),
          email: email.trim(),
          phone: phone.trim(),
          services,
          notes,
        });
        toast(`${name.trim()} updated.`);
      } else {
        await addClientAsync({
          name: name.trim(),
          type,
          kycEntityType: kyc || "Individual / Proprietor",
          pan: pan.trim().toUpperCase(),
          gstin: gstin.trim().toUpperCase(),
          email: email.trim(),
          phone: phone.trim(),
          services,
          notes,
        });
        toast(`${name.trim()} added to your clients.`);
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast(initialClient ? "Failed to update client" : "Failed to add client", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialClient ? "Edit client" : "Add client"}
      description={
        initialClient
          ? "Update client details and compliance services."
          : "Only the name is required — you can fill in the rest later."
      }
      footer={
        <>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit} disabled={submitting}>
            {submitting
              ? initialClient
                ? "Saving..."
                : "Adding..."
              : initialClient
                ? "Save changes"
                : "Add client"}
          </Button>
        </>
      }
    >
      {error ? (
        <div className="rounded border border-danger/50 bg-danger-soft px-3 py-2 text-[13px] text-danger">
          {error}
        </div>
      ) : null}
      <Field label="Client name" required>
        <TextInput value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Client type">
        <Select value={type} onChange={setType} options={M.CLIENT_TYPES} />
      </Field>
      <Field
        label="KYC entity type"
        required
        helper="Creates the right KYC checklist after the client is added"
      >
        <Select
          value={kyc}
          onChange={setKyc}
          options={M.KYC_ENTITY_TYPES}
          placeholder="Choose an entity type"
        />
      </Field>
      <Field label="PAN" helper="Optional. e.g. ABCDE1234F">
        <TextInput
          placeholder="ABCDE1234F"
          value={pan}
          onChange={(e) => setPan(e.target.value)}
        />
      </Field>
      <Field
        label="GSTIN"
        helper="Optional. 15 characters, e.g. 27ABCDE1234F1Z5"
      >
        <TextInput
          placeholder="27ABCDE1234F1Z5"
          value={gstin}
          onChange={(e) => setGstin(e.target.value)}
        />
      </Field>
      <Field label="Email">
        <TextInput
          placeholder="client@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>
      <Field label="Phone" helper="Used for the WhatsApp document link">
        <TextInput
          placeholder="98765 43210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </Field>
      <div>
        <p className="mb-1.5 text-[13px] font-medium text-foreground">Services</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {M.SERVICES.map((s) => (
            <CheckboxCard
              key={s}
              label={s}
              checked={services.includes(s)}
              onToggle={() =>
                setServices((sv) =>
                  sv.includes(s) ? sv.filter((x) => x !== s) : [...sv, s],
                )
              }
            />
          ))}
        </div>
      </div>
      <Field label="Notes">
        <TextArea
          placeholder="Anything worth remembering"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Field>
    </Modal>
  );
}

/* ---------------- Add deadline ---------------- */

export function AddDeadlineModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { clientNames, addDeadlineAsync, toast } = useStore();
  const [client, setClient] = useState("");
  const [what, setWhat] = useState("");
  const [service, setService] = useState("Other");
  const [due, setDue] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!client || !what.trim() || !due) {
      setError("Client, what is due and the due date are required.");
      return;
    }
    const dueDate = new Date(due);
    const days = Math.floor((Date.now() - dueDate.getTime()) / 86400000);
    setSubmitting(true);
    try {
      await addDeadlineAsync({
        task: what.trim(),
        service,
        period: notes.trim() || "One-off",
        client,
        daysOverdue: days > 0 ? days : 0,
        dueDate: dueDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: days > 0 ? "Overdue" : "Open",
      });
      toast("Deadline added.");
      setClient("");
      setWhat("");
      setService("Other");
      setDue("");
      setNotes("");
      setError("");
      onClose();
    } catch (err) {
      console.error(err);
      toast("Failed to add deadline", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a one-off deadline"
      description="For dates the compliance calendar cannot know — a notice reply-by date, a hearing, and ad-hoc filing."
      footer={
        <>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit} disabled={submitting}>
            {submitting ? "Adding..." : "Add deadline"}
          </Button>
        </>
      }
    >
      {error ? (
        <div className="rounded border border-danger/50 bg-danger-soft px-3 py-2 text-[13px] text-danger">
          {error}
        </div>
      ) : null}
      <Field label="Client" required>
        <Select
          value={client}
          onChange={setClient}
          options={clientNames}
          placeholder="Choose a client"
        />
      </Field>
      <Field label="What is due" required>
        <TextInput
          placeholder="Reply to 143(2) notice"
          value={what}
          onChange={(e) => setWhat(e.target.value)}
        />
      </Field>
      <Field label="Service">
        <Select value={service} onChange={setService} options={M.SERVICES} />
      </Field>
      <Field label="Due date" required>
        <TextInput
          type="date"
          placeholder="dd-mm-yyyy"
          value={due}
          onChange={(e) => setDue(e.target.value)}
        />
      </Field>
      <Field label="Notes">
        <TextArea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Field>
    </Modal>
  );
}

/* ---------------- Request documents ---------------- */

type DocItem = { id: string; name: string; required: boolean };

export function RequestDocsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { clientNames, addDocRequestAsync, toast } = useStore();
  const [client, setClient] = useState("");
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<DocItem[]>([
    { id: nextId("i"), name: "Form 16", required: true },
  ]);
  const [message, setMessage] = useState("");
  const [days, setDays] = useState("30");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const applyChecklist = (name: string) => {
    setTitle(name);
    setItems(
      (M.CHECKLISTS[name] ?? []).map((n) => ({
        id: nextId("i"),
        name: n,
        required: true,
      })),
    );
  };

  const submit = async () => {
    const named = items.filter((i) => i.name.trim());
    if (!client || !title.trim() || !named.length) {
      setError("Client, title and at least one document are required.");
      return;
    }
    const expires = new Date(Date.now() + Number(days || 30) * 86400000);
    setSubmitting(true);
    try {
      await addDocRequestAsync({
        title: title.trim(),
        client,
        items: named,
        message,
        received: `0 of ${named.length}`,
        expires: expires.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: "Open",
      });
      toast("Upload link created and ready to share.");
      setClient("");
      setTitle("");
      setItems([{ id: nextId("i"), name: "Form 16", required: true }]);
      setMessage("");
      setDays("30");
      setError("");
      onClose();
    } catch (err) {
      console.error(err);
      toast("Failed to create document request", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Request documents"
      description="Your client gets a link they can upload from — no login required."
      footer={
        <>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit} disabled={submitting}>
            {submitting ? "Creating..." : "Create link"}
          </Button>
        </>
      }
    >
      {error ? (
        <div className="rounded border border-danger/50 bg-danger-soft px-3 py-2 text-[13px] text-danger">
          {error}
        </div>
      ) : null}
      <Field label="Client" required>
        <Select
          value={client}
          onChange={setClient}
          options={clientNames}
          placeholder="Choose a client"
        />
      </Field>
      <div>
        <p className="mb-1.5 text-[13px] font-medium text-foreground">
          Start from a checklist
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(M.CHECKLISTS).map((c) => (
            <Button key={c} size="sm" onClick={() => applyChecklist(c)}>
              {c}
            </Button>
          ))}
        </div>
      </div>
      <Field label="Title" required>
        <TextInput
          placeholder="ITR 2026-27 documents"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Field>
      <div>
        <p className="mb-1.5 text-[13px] font-medium text-foreground">
          Documents needed <span className="text-danger">*</span>
        </p>
        <div className="space-y-2">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-2">
              <TextInput
                value={it.name}
                onChange={(e) =>
                  setItems((xs) =>
                    xs.map((x) => (x.id === it.id ? { ...x, name: e.target.value } : x)),
                  )
                }
              />
              <Checkbox
                label="Required"
                checked={it.required}
                onToggle={() =>
                  setItems((xs) =>
                    xs.map((x) => (x.id === it.id ? { ...x, required: !x.required } : x)),
                  )
                }
              />
              <Button
                variant="danger"
                size="sm"
                onClick={() => setItems((xs) => xs.filter((x) => x.id !== it.id))}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
        <Button
          size="sm"
          className="mt-2"
          onClick={() =>
            setItems((xs) => [...xs, { id: nextId("i"), name: "", required: true }])
          }
        >
          + Add item
        </Button>
      </div>
      <Field label="Message (optional)">
        <TextArea
          placeholder="Please send these by Friday so we can file on time."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </Field>
      <Field
        label="Link expires in (days)"
        helper="Links are time-limited so an old one cannot be reused"
      >
        <TextInput value={days} onChange={(e) => setDays(e.target.value)} />
      </Field>
    </Modal>
  );
}

/* ---------------- Log a fee ---------------- */

export function LogFeeModal({
  open,
  onClose,
  initialFee,
}: {
  open: boolean;
  onClose: () => void;
  initialFee?: M.Fee | null;
}) {
  const { clientNames, addFeeAsync, updateFeeAsync, toast } = useStore();
  const [client, setClient] = useState("");
  const [forWhat, setForWhat] = useState("");
  const [amount, setAmount] = useState("");
  const [service, setService] = useState("No service");
  const [status, setStatus] = useState<M.Fee["status"]>("Invoiced");
  const [due, setDue] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialFee) {
      setClient(initialFee.client || "");
      setForWhat(initialFee.forWhat || "");
      setAmount(initialFee.amount !== undefined ? String(initialFee.amount) : "");
      setService(initialFee.service || "No service");
      setStatus(initialFee.status || "Invoiced");
      setDue(initialFee.due || "");
      setError("");
    } else {
      setClient("");
      setForWhat("");
      setAmount("");
      setService("No service");
      setStatus("Invoiced");
      setDue("");
      setError("");
    }
  }, [initialFee, open]);

  const submit = async () => {
    const num = Number(amount.replace(/,/g, ""));
    if (!client || !forWhat.trim() || !amount.trim() || Number.isNaN(num)) {
      setError("Client, what it is for and a valid amount are required.");
      return;
    }
    setSubmitting(true);
    try {
      if (initialFee) {
        await updateFeeAsync(initialFee.id, {
          forWhat: forWhat.trim(),
          service: service === "No service" ? "" : service,
          client,
          amount: num,
          due: due,
          status,
        });
        toast(`Fee updated for ${client}.`);
      } else {
        await addFeeAsync({
          forWhat: forWhat.trim(),
          service: service === "No service" ? "" : service,
          client,
          amount: num,
          due: due
            ? new Date(due).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "",
          status,
        });
        toast(`Fee logged for ${client}.`);
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast(initialFee ? "Failed to update fee" : "Failed to log fee", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialFee ? "Edit fee" : "Log a fee"}
      description={
        initialFee
          ? "Update fee details, amount and status."
          : "Track what you have billed and what has come in."
      }
      footer={
        <>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit} disabled={submitting}>
            {submitting
              ? initialFee
                ? "Saving..."
                : "Logging..."
              : initialFee
                ? "Save changes"
                : "Log fee"}
          </Button>
        </>
      }
    >
      {error ? (
        <div className="rounded border border-danger/50 bg-danger-soft px-3 py-2 text-[13px] text-danger">
          {error}
        </div>
      ) : null}
      <Field label="Client" required>
        <Select
          value={client}
          onChange={setClient}
          options={clientNames}
          placeholder="Choose a client"
        />
      </Field>
      <Field label="For what" required>
        <TextInput value={forWhat} onChange={(e) => setForWhat(e.target.value)} />
      </Field>
      <Field label="Amount (₹)" required helper="e.g. 2500 or 2,500.50">
        <TextInput
          placeholder="2500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Field>
      <Field label="Service">
        <Select
          value={service}
          onChange={setService}
          options={["No service", ...M.SERVICES]}
        />
      </Field>
      <Field label="Status">
        <Select
          value={status}
          onChange={(v) => setStatus(v as M.Fee["status"])}
          options={["Invoiced", "Paid", "Overdue", "Draft"]}
        />
      </Field>
      <Field label="Due date" helper="Overdue is worked out from this">
        <TextInput
          type="date"
          placeholder="dd-mm-yyyy"
          value={due}
          onChange={(e) => setDue(e.target.value)}
        />
      </Field>
    </Modal>
  );
}

/* ---------------- Invite someone ---------------- */

export function InviteModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addTeamMemberAsync, toast } = useStore();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Staff");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!email.includes("@")) {
      setError("A valid email address is required.");
      return;
    }
    setSubmitting(true);
    try {
      const name = email.split("@")[0] || "Team Member";
      await addTeamMemberAsync({
        name,
        email: email.trim(),
        role,
      });
      toast(`Invitation sent to ${email.trim()}.`);
      setEmail("");
      setRole("Staff");
      setError("");
      onClose();
    } catch (err) {
      console.error(err);
      toast("Failed to invite member", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Invite someone"
      description={`Sent ${todayLabel()} · the link expires in 7 days.`}
      footer={
        <>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit} disabled={submitting}>
            {submitting ? "Sending..." : "Send invitation"}
          </Button>
        </>
      }
    >
      {error ? (
        <div className="rounded border border-danger/50 bg-danger-soft px-3 py-2 text-[13px] text-danger">
          {error}
        </div>
      ) : null}
      <Field label="Email" required>
        <TextInput
          placeholder="colleague@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>
      <Field label="Role">
        <Select value={role} onChange={setRole} options={M.ROLES} />
      </Field>
    </Modal>
  );
}

/* ---------------- Share Document Request Modal ---------------- */

export function ShareDocModal({
  open,
  onClose,
  request,
}: {
  open: boolean;
  onClose: () => void;
  request: M.DocRequest | null;
}) {
  const { toast } = useStore();
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  if (!open || !request) return null;

  const uploadUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/upload/${request.id}`
      : `https://caconnect.in/upload/${request.id}`;

  const messageText = `Hi ${request.client}, please upload the requested documents (${request.title}) for your CA compliance using this secure link: ${uploadUrl}`;

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(uploadUrl);
    }
    setCopied(true);
    toast("Link copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="product-frame w-full max-w-lg bg-[#141721] border border-[#232736] p-6 rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-sans text-base font-semibold text-foreground">
              Send this to {request.client}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              They can upload from their phone — no account, no app.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* WhatsApp Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-2 rounded bg-[#f4f4ee] hover:bg-white text-[#12141d] font-medium py-2.5 text-xs transition-colors shadow-sm"
          >
            <MessageCircle className="size-4 fill-current" />
            Send on WhatsApp
          </button>
        </div>

        {/* Copy Link Section */}
        <div className="mt-4">
          <p className="mb-1.5 text-xs text-muted-foreground">Or copy the link</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={uploadUrl}
              className="flex-1 rounded border border-border bg-[#0d0e15] px-3 py-2 text-xs font-mono text-muted-foreground select-all focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              title="Copy link"
              className="flex items-center justify-center rounded border border-border bg-[#181b27] p-2 text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
            >
              {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
            </button>
          </div>
        </div>

        {/* Preview Collapsible */}
        <div className="mt-4 border border-border/60 rounded bg-[#0d0e15]/60 p-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-left"
          >
            <span className="text-[10px]">{showPreview ? "▼" : "▶"}</span>
            <span>Preview the message</span>
          </button>
          {showPreview ? (
            <div className="mt-2.5 pt-2.5 border-t border-border/40 text-xs text-muted-foreground leading-relaxed select-text">
              {messageText}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-border bg-[#1a1f2e] hover:bg-[#23293b] text-foreground px-4 py-1.5 text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

