"use client";

import {
  useEffect,
  useState,
  useRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { useStore } from "./store";

/* ---------------- Button ---------------- */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
};

export function Button({
  variant = "secondary",
  size = "md",
  className = "",
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded font-medium transition-colors disabled:opacity-45 disabled:cursor-not-allowed whitespace-nowrap";
  const sizes = size === "sm" ? "h-7 px-2.5 text-xs" : "h-8 px-3 text-[13px]";
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/85",
    secondary:
      "border border-border bg-surface-2 text-foreground hover:border-border-strong hover:bg-accent",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-accent",
    danger:
      "border border-border bg-surface-2 text-danger hover:border-danger hover:bg-danger-soft/40",
  }[variant];
  return <button className={`${base} ${sizes} ${variants} ${className}`} {...rest} />;
}

/* ---------------- Badge ---------------- */

const badgeTone: Record<string, string> = {
  Overdue: "bg-danger-soft text-danger border-danger/40",
  Expired: "bg-danger-soft text-danger border-danger/40",
  Short: "bg-danger-soft text-danger border-danger/40",
  "In Progress": "bg-info-soft text-info border-info/40",
  Invoiced: "bg-info-soft text-info border-info/40",
  requested: "bg-info-soft text-info border-info/40",
  Paid: "bg-success-soft text-success border-success/40",
  Filed: "bg-success-soft text-success border-success/40",
  Completed: "bg-success-soft text-success border-success/40",
  accepted: "bg-success-soft text-success border-success/40",
  completed: "bg-success-soft text-success border-success/40",
  "On track": "bg-success-soft text-success border-success/40",
  Received: "bg-warn-soft text-warn border-warn/40",
  Preparation: "bg-warn-soft text-warn border-warn/40",
  Draft: "bg-surface-2 text-muted-foreground border-border",
};

export function Badge({ children }: { children: ReactNode }) {
  const key = String(children);
  const tone = badgeTone[key] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[11px] font-medium leading-4 ${tone}`}
    >
      {children}
    </span>
  );
}

/* ---------------- Page header ---------------- */

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="page-title text-foreground">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`card-surface ${className}`}>{children}</div>;
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="border-b border-border px-4 py-3 text-sm font-semibold text-foreground">
      {children}
    </h2>
  );
}

export function Kpi({
  label,
  value,
  tone,
}: {
  label: string;
  value: ReactNode;
  tone?: "danger" | "warn" | "success";
}) {
  const color =
    tone === "danger"
      ? "text-danger"
      : tone === "warn"
        ? "text-warn"
        : tone === "success"
          ? "text-success"
          : "text-foreground";
  return (
    <div className="card-surface px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-1.5 font-serif text-2xl ${color}`}>{value}</p>
    </div>
  );
}

export function AlertBanner({
  children,
  tone = "warn",
}: {
  children: ReactNode;
  tone?: "warn" | "info";
}) {
  const cls =
    tone === "warn"
      ? "border-warn/40 bg-warn-soft/50 text-warn"
      : "border-border bg-surface text-muted-foreground";
  return (
    <div className={`rounded border px-3 py-2 text-[13px] ${cls}`}>{children}</div>
  );
}

export function EmptyState({
  symbol = "◇",
  title,
  hint,
  action,
}: {
  symbol?: string;
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="mb-3 text-2xl text-muted-foreground">{symbol}</span>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {hint ? (
        <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">{hint}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

/* ---------------- Table ---------------- */

export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[680px] border-collapse text-left text-[13px]">
        {children}
      </table>
    </div>
  );
}

export function Th({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`border-b border-border px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground ${className}`}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <td className={`border-b border-border/70 px-4 py-2.5 align-middle ${className}`}>
      {children}
    </td>
  );
}

/* ---------------- Form fields ---------------- */

export function Field({
  label,
  required,
  helper,
  children,
}: {
  label: string;
  required?: boolean;
  helper?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-medium text-foreground">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </span>
      {children}
      {helper ? (
        <span className="mt-1 block text-[11px] text-muted-foreground">{helper}</span>
      ) : null}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`field-input ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={4}
      {...props}
      className={`field-input min-h-[100px] resize-y leading-relaxed ${props.className ?? ""}`}
    />
  );
}

export function Select({
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <select
      className="field-input"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function CheckboxCard({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-2 rounded border px-2.5 py-2 text-left text-[13px] transition-colors ${
        checked
          ? "border-border-strong bg-accent text-foreground"
          : "border-border bg-surface-2 text-muted-foreground hover:border-border-strong"
      }`}
    >
      <span
        className={`grid h-3.5 w-3.5 place-items-center rounded-sm border text-[10px] ${
          checked ? "border-foreground bg-foreground text-primary-foreground" : "border-border"
        }`}
      >
        {checked ? "✓" : ""}
      </span>
      {label}
    </button>
  );
}

export function Checkbox({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground"
    >
      <span
        className={`grid h-3.5 w-3.5 place-items-center rounded-sm border text-[10px] ${
          checked ? "border-foreground bg-foreground text-primary-foreground" : "border-border"
        }`}
      >
        {checked ? "✓" : ""}
      </span>
      {label}
    </button>
  );
}

export function FileInput({
  onPick,
  onFileChange,
  fileName,
  accept,
}: {
  onPick?: (name: string) => void;
  onFileChange?: (file: File | null) => void;
  fileName?: string;
  accept?: string;
}) {
  return (
    <div className="field-input flex items-center gap-2.5 !py-1 !px-1.5 h-9">
      <label className="inline-flex h-7 cursor-pointer items-center rounded border border-border bg-surface-2 px-2.5 text-[12.5px] font-medium text-foreground hover:bg-surface-3 hover:border-border-strong transition-colors shrink-0">
        Browse
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => {
            const f = e.target.files?.[0] || null;
            onPick?.(f?.name ?? "");
            onFileChange?.(f);
          }}
        />
      </label>
      <span className="truncate text-[12.5px] text-muted-foreground select-none">
        {fileName || "No file chosen"}
      </span>
    </div>
  );
}

/* ---------------- Tabs / filters ---------------- */

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`-mb-px border-b-2 px-3 py-2 text-[13px] transition-colors ${
            active === t
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export function SectionBar({ children }: { children: ReactNode }) {
  return (
    <div className="border-b border-border bg-surface px-4 py-2 text-[12px] text-muted-foreground">
      {children}
    </div>
  );
}

/* ---------------- More menu ---------------- */

export interface MoreMenuItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
  divider?: boolean;
  icon?: ReactNode;
}

export function MoreMenu({
  items,
  align = "right",
}: {
  items: MoreMenuItem[];
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 155;
      const left =
        align === "right"
          ? Math.max(8, rect.right - menuWidth)
          : Math.min(window.innerWidth - menuWidth - 8, rect.left);
      setCoords({
        top: rect.bottom + 4,
        left,
      });
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleScroll = () => setOpen(false);
    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="More actions"
        onClick={toggle}
        className="inline-flex h-7 min-w-7 items-center justify-center rounded border border-border bg-surface-2 px-2 py-1 text-xs font-bold leading-none text-muted-foreground transition-colors hover:border-border-strong hover:bg-accent hover:text-foreground"
      >
        •••
      </button>
      {open && coords ? (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
            zIndex: 9999,
          }}
          className="min-w-[155px] rounded-md border border-border bg-[#161922] p-1 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((it, idx) => (
            <div key={idx}>
              {it.divider ? <div className="my-1 border-t border-border/80" /> : null}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(false);
                  it.onClick();
                }}
                className={`flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-[13px] transition-colors ${
                  it.danger
                    ? "text-danger hover:bg-danger/15 font-medium"
                    : "text-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {it.icon ? <span className="shrink-0">{it.icon}</span> : null}
                <span>{it.label}</span>
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

/* ---------------- Modal ---------------- */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 backdrop-blur-xs p-4 sm:items-center">
      <div className={`w-full ${maxWidth} rounded-lg border border-border bg-surface shadow-2xl overflow-hidden`}>
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-3.5">
          <div>
            <h2 className="font-serif text-lg text-foreground">{title}</h2>
            {description ? (
              <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded p-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[78vh] space-y-4 overflow-y-auto px-5 py-4">{children}</div>
        {footer ? (
          <div className="flex justify-end gap-2 border-t border-border px-5 py-3 bg-surface/50">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ---------------- Toasts ---------------- */

export function Toasts() {
  const { toasts } = useStore();
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex w-72 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded border px-3 py-2 text-[13px] shadow-lg ${
            t.kind === "error"
              ? "border-danger/50 bg-danger-soft text-danger"
              : "border-success/50 bg-success-soft text-success"
          }`}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}

export function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <div className="w-24">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#242938]">
        <div
          className="h-full rounded-full bg-[#d97706] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground whitespace-nowrap">
        {value}/{total} done
      </p>
    </div>
  );
}
