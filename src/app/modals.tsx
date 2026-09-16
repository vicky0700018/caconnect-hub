"use client";

import { useState } from "react";
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
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { setClients, toast } = useStore();
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

  const reset = () => {
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
  };

  const submit = () => {
    if (!name.trim() || !kyc) {
      setError("Client name and KYC entity type are required.");
      return;
    }
    setClients((cs) => [
      ...cs,
      {
        id: nextId("c"),
        name: name.trim(),
        type,
        kycEntityType: kyc,
        pan: pan.trim().toUpperCase(),
        gstin: gstin.trim().toUpperCase(),
        email: email.trim(),
        phone: phone.trim(),
        services,
        notes,
      },
    ]);
    toast(`${name.trim()} added to your clients.`);
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add client"
      description="Only the name is required — you can fill in the rest later."
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>
            Add client
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
  const { clientNames, setDeadlines, toast } = useStore();
  const [client, setClient] = useState("");
  const [what, setWhat] = useState("");
  const [service, setService] = useState("Other");
  const [due, setDue] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (!client || !what.trim() || !due) {
      setError("Client, what is due and the due date are required.");
      return;
    }
    const dueDate = new Date(due);
    const days = Math.floor((Date.now() - dueDate.getTime()) / 86400000);
    setDeadlines((ds) => [
      {
        id: nextId("d"),
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
      },
      ...ds,
    ]);
    toast("Deadline added.");
    setClient("");
    setWhat("");
    setService("Other");
    setDue("");
    setNotes("");
    setError("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a one-off deadline"
      description="For dates the compliance calendar cannot know — a notice reply-by date, a hearing, and ad-hoc filing."
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>
            Add deadline
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
  const { clientNames, setDocRequests, toast } = useStore();
  const [client, setClient] = useState("");
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<DocItem[]>([
    { id: nextId("i"), name: "Form 16", required: true },
  ]);
  const [message, setMessage] = useState("");
  const [days, setDays] = useState("30");
  const [error, setError] = useState("");

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

  const submit = () => {
    const named = items.filter((i) => i.name.trim());
    if (!client || !title.trim() || !named.length) {
      setError("Client, title and at least one document are required.");
      return;
    }
    const expires = new Date(Date.now() + Number(days || 30) * 86400000);
    setDocRequests((rs) => [
      {
        id: nextId("dr"),
        title: title.trim(),
        client,
        received: `0 of ${named.length}`,
        expires: expires.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: "Open",
      },
      ...rs,
    ]);
    toast("Upload link created and ready to share.");
    setClient("");
    setTitle("");
    setItems([{ id: nextId("i"), name: "Form 16", required: true }]);
    setMessage("");
    setDays("30");
    setError("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Request documents"
      description="Your client gets a link they can upload from — no login required."
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>
            Create link
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
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { clientNames, setFees, toast } = useStore();
  const [client, setClient] = useState("");
  const [forWhat, setForWhat] = useState("");
  const [amount, setAmount] = useState("");
  const [service, setService] = useState("No service");
  const [status, setStatus] = useState<M.Fee["status"]>("Invoiced");
  const [due, setDue] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    const num = Number(amount.replace(/,/g, ""));
    if (!client || !forWhat.trim() || !amount.trim() || Number.isNaN(num)) {
      setError("Client, what it is for and a valid amount are required.");
      return;
    }
    setFees((fs) => [
      {
        id: nextId("f"),
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
      },
      ...fs,
    ]);
    toast(`Fee logged for ${client}.`);
    setClient("");
    setForWhat("");
    setAmount("");
    setService("No service");
    setStatus("Invoiced");
    setDue("");
    setError("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log a fee"
      description="Track what you have billed and what has come in."
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>
            Log fee
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
  const { setInvitations, toast } = useStore();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Staff");
  const [error, setError] = useState("");

  const submit = () => {
    if (!email.includes("@")) {
      setError("A valid email address is required.");
      return;
    }
    setInvitations((is) => [
      ...is,
      {
        id: nextId("iv"),
        email: email.trim(),
        role,
        expires: new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      },
    ]);
    toast(`Invitation sent to ${email.trim()}.`);
    setEmail("");
    setRole("Staff");
    setError("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Invite someone"
      description={`Sent ${todayLabel()} · the link expires in 7 days.`}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>
            Send invitation
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
