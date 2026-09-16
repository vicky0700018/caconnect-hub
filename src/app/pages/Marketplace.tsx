"use client";

import { useState } from "react";
import { formatINR, packages, reviews } from "@/data/mockData";
import { useStore } from "../store";
import { Badge, Button, Card, CardTitle, PageHeader, Tabs } from "../ui";

export default function Marketplace() {
  const { bookings, updateBookingStatusAsync, addClientAsync, toast } = useStore();
  const [tab, setTab] = useState("Listing");

  const newCount = bookings.filter((b) => b.status === "requested").length;
  const tabs = [
    "Listing",
    `Packages (${packages.length})`,
    `Bookings (${newCount} new)`,
    `Reviews (${reviews.length})`,
  ];
  const activeTab = tabs.find((t) => t.startsWith(tab)) ?? "Listing";

  const setStatus = async (id: string, status: "accepted" | "declined" | "completed") => {
    await updateBookingStatusAsync(id, status);
    if (status === "accepted") {
      const b = bookings.find((x) => x.id === id);
      if (b) {
        await addClientAsync({
          name: b.name,
          type: "Individual",
          kycEntityType: "Individual",
          pan: "",
          gstin: "",
          email: b.email,
          phone: b.phone,
          services: [b.service],
          notes: `Created from Marketplace Booking: ${b.message || ""}`,
        });
      }
    }
    toast(
      status === "accepted"
        ? "Booking accepted — client added to your list."
        : status === "declined"
          ? "Booking declined."
          : "Marked complete — the client can now leave a review.",
    );
  };

  return (
    <>
      <PageHeader
        title="Marketplace"
        subtitle="Your firm is listed publicly. Clients can find you and request work."
      />

      <Tabs
        tabs={tabs}
        active={activeTab}
        onChange={(t) => setTab(t.split(" (")[0] ?? t)}
      />

      <div className="mt-4">
        {tab === "Listing" ? (
          <Card>
            <CardTitle>Firm listing</CardTitle>
            <div className="space-y-4 p-4 text-[13px]">
              <div>
                <p className="font-serif text-xl text-foreground">Sthambhalliance</p>
                <p className="text-muted-foreground">
                  Chartered Accountants · Pune, Maharashtra · Practising since 2011
                </p>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                A small practice handling GST compliance, income tax, statutory audit and company
                incorporation for owner-managed businesses and professionals. Filings are handled
                in-house, and every client speaks to the same person each month.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Response time", "Within 1 working day"],
                  ["Languages", "English, Hindi, Marathi"],
                  ["Clients served", "220+"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded border border-border bg-surface-2 px-3 py-2">
                    <p className="text-[11px] uppercase text-muted-foreground">{k}</p>
                    <p className="text-foreground">{v}</p>
                  </div>
                ))}
              </div>
              <Button onClick={() => toast("Listing saved.")}>Save listing</Button>
            </div>
          </Card>
        ) : null}

        {tab === "Packages" ? (
          <div className="grid gap-3 md:grid-cols-3">
            {packages.map((p) => (
              <Card key={p.id} className="p-4">
                <p className="text-sm font-medium text-foreground">{p.name}</p>
                <p className="mt-1 font-serif text-2xl text-foreground">{formatINR(p.price)}</p>
                <p className="text-[12px] text-muted-foreground">{p.turnaround}</p>
                <ul className="mt-3 space-y-1 text-[13px] text-muted-foreground">
                  {p.includes.map((i) => (
                    <li key={i}>· {i}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        ) : null}

        {tab === "Bookings" ? (
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                No client bookings received yet. Public marketplace inquiries will appear here.
              </Card>
            ) : (
              bookings.map((b) => (
                <Card key={b.id} className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{b.name}</p>
                        <Badge>{b.status}</Badge>
                        {b.status === "accepted" || b.status === "completed" ? (
                          <span className="text-[12px] text-muted-foreground">In your clients</span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-[13px] text-muted-foreground">
                        {b.email} · {b.phone} · {b.city}
                      </p>
                      <p className="mt-2 text-[13px] text-foreground">{b.service}</p>
                      <p className="text-[12px] text-muted-foreground">{b.requestDate}</p>
                      {b.message ? (
                        <p className="mt-2 max-w-xl rounded border border-border bg-surface-2 px-3 py-2 text-[13px] text-muted-foreground">
                          {b.message}
                        </p>
                      ) : null}
                    </div>
                    <div className="sm:text-right">
                      <p className="font-serif text-2xl text-foreground">{formatINR(b.amount)}</p>
                      <p className="text-[12px] text-muted-foreground">
                        {formatINR(b.platformFee)} platform fee
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        from the client, not you · not charged yet
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 sm:justify-end">
                        {b.status === "requested" ? (
                          <>
                            <Button variant="primary" onClick={() => setStatus(b.id, "accepted")}>
                              Accept
                            </Button>
                            <Button variant="danger" onClick={() => setStatus(b.id, "declined")}>
                              Decline
                            </Button>
                          </>
                        ) : b.status === "accepted" ? (
                          <Button onClick={() => setStatus(b.id, "completed")}>Mark complete</Button>
                        ) : null}
                      </div>
                      {b.status === "accepted" ? (
                        <p className="mt-2 text-[11px] text-muted-foreground">
                          Marking it complete is what lets the client leave a review.
                        </p>
                      ) : null}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        ) : null}

        {tab === "Reviews" ? (
          <div className="space-y-3">
            {reviews.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{r.author}</p>
                  <p className="text-[12px] text-muted-foreground">{r.date}</p>
                </div>
                <p className="text-warn">{"★".repeat(r.rating)}</p>
                <p className="mt-2 text-[13px] text-muted-foreground">{r.text}</p>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
