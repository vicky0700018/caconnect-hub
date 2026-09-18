"use client";

import { useState, useEffect } from "react";
import { formatINR, packages as initialPackages, reviews, Package } from "@/data/mockData";
import { useStore } from "../store";
import { Badge, Button, Card, PageHeader, Tabs, Field, TextInput, TextArea, Modal } from "../ui";
import { Copy, ExternalLink, Plus, Trash2 } from "lucide-react";

const SPECIALISATIONS_LIST = [
  "ITR",
  "GSTR-1",
  "GSTR-3B",
  "TDS",
  "ROC",
  "Company Registration",
  "Advance Tax",
  "Other",
];

export default function Marketplace() {
  const { bookings, updateBookingStatusAsync, addClientAsync, toast } = useStore();
  const [tab, setTab] = useState("Listing");

  // Listing Form State (Clean default values for our firm)
  const [publicName, setPublicName] = useState("Sthambhalliance");
  const [icaiNo, setIcaiNo] = useState("");
  const [city, setCity] = useState("New Delhi");
  const [stateName, setStateName] = useState("Delhi");
  const [experience, setExperience] = useState("10");
  const [languages, setLanguages] = useState("English, Hindi");
  const [headline, setHeadline] = useState("Statutory audit, tax compliance and corporate advisory services");
  const [about, setAbout] = useState(
    "A dedicated chartered accountancy practice providing end-to-end GST compliance, income tax filings, corporate law matters and auditing for businesses and professionals."
  );
  const [selectedSpecialisations, setSelectedSpecialisations] = useState<string[]>([
    "ITR",
    "GSTR-1",
    "GSTR-3B",
    "TDS",
    "ROC",
  ]);

  // Packages State & Modals
  const [packageList, setPackageList] = useState<Package[]>(initialPackages);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [pkgName, setPkgName] = useState("");
  const [pkgCategory, setPkgCategory] = useState("Company Registration");
  const [pkgPrice, setPkgPrice] = useState("15000");
  const [pkgTurnaround, setPkgTurnaround] = useState("Usually 12 days");
  const [pkgDescription, setPkgDescription] = useState("");

  const newCount = bookings.filter((b) => b.status === "requested").length;
  const tabs = [
    "Listing",
    `Packages (${packageList.length})`,
    `Bookings (${newCount > 0 ? `${newCount} new` : bookings.length})`,
    `Reviews (${reviews.length})`,
  ];
  const activeTab = tabs.find((t) => t.startsWith(tab)) ?? "Listing";

  const publicSlug = publicName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const citySlug = city.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const profilePath = `/ca/${publicSlug || "firm"}${citySlug ? `-${citySlug}` : ""}`;
  const publicUrl = `https://caconnect-hub.vercel.app${profilePath}`;

  const toggleSpecialisation = (spec: string) => {
    setSelectedSpecialisations((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const handleOpenAddPackage = () => {
    setEditingPackage(null);
    setPkgName("");
    setPkgCategory("Company Registration");
    setPkgPrice("15000");
    setPkgTurnaround("Usually 12 days");
    setPkgDescription("");
    setPackageModalOpen(true);
  };

  const handleOpenEditPackage = (pkg: Package) => {
    setEditingPackage(pkg);
    setPkgName(pkg.name);
    setPkgCategory(pkg.category || "Company Registration");
    setPkgPrice(String(pkg.price));
    setPkgTurnaround(pkg.turnaround || "Usually 12 days");
    setPkgDescription(pkg.description || "");
    setPackageModalOpen(true);
  };

  const handleSavePackage = () => {
    if (!pkgName.trim()) {
      toast("Package name is required.", "error");
      return;
    }
    const numPrice = Number(pkgPrice) || 0;
    if (editingPackage) {
      setPackageList((prev) =>
        prev.map((p) =>
          p.id === editingPackage.id
            ? {
                ...p,
                name: pkgName.trim(),
                category: pkgCategory,
                price: numPrice,
                turnaround: pkgTurnaround.trim(),
                description: pkgDescription.trim(),
              }
            : p
        )
      );
      toast("Package updated.");
    } else {
      const newPkg: Package = {
        id: `pkg-${Date.now()}`,
        name: pkgName.trim(),
        category: pkgCategory,
        price: numPrice,
        turnaround: pkgTurnaround.trim(),
        description: pkgDescription.trim(),
      };
      setPackageList((prev) => [newPkg, ...prev]);
      toast("Package created.");
    }
    setPackageModalOpen(false);
  };

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
          : "Marked complete — the client can now leave a review."
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
        {/* Tab 1: Listing */}
        {tab === "Listing" && (
          <div className="space-y-4">
            {/* Card 1: Live on the marketplace */}
            <Card className="p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-foreground mb-2">Live on the marketplace</h3>
              <div className="relative flex items-center">
                <input
                  type="text"
                  readOnly
                  value={publicUrl}
                  className="field-input pr-10 font-mono text-xs text-muted-foreground select-all bg-surface-2"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(publicUrl);
                    }
                    toast("Public link copied to clipboard.");
                  }}
                  title="Copy link"
                  className="absolute right-2 p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-secondary transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 mt-3.5 pt-1">
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.open(profilePath, "_blank");
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-xs"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View public page
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast("Listing withdrawn from public marketplace.")}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    Withdraw listing
                  </Button>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-amber-400 text-sm tracking-tighter">★★★★★</span>
                  <span className="font-semibold text-foreground">5.0</span>
                  <span className="text-muted-foreground">({reviews.length} review{reviews.length === 1 ? "" : "s"})</span>
                </div>
              </div>
            </Card>

            {/* Card 2: Your public listing */}
            <Card className="p-4 sm:p-5">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Your public listing</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  This is what someone looking for a CA sees. Your clients&apos; details, your fees and everything else in CAConnect stay private — only what is on this form is public.
                </p>
              </div>

              <div className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Public name" required>
                    <TextInput
                      value={publicName}
                      onChange={(e) => setPublicName(e.target.value)}
                      placeholder="e.g. Sthambhalliance"
                    />
                  </Field>
                  <Field label="ICAI membership no." helper="Shown as a trust signal">
                    <TextInput
                      value={icaiNo}
                      onChange={(e) => setIcaiNo(e.target.value)}
                      placeholder="e.g. 123456"
                    />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="City" required helper="How clients search">
                    <TextInput
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. New Delhi"
                    />
                  </Field>
                  <Field label="State">
                    <TextInput
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="e.g. Delhi"
                    />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Years of experience">
                    <TextInput
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="e.g. 10"
                    />
                  </Field>
                  <Field label="Languages" helper="Comma separated">
                    <TextInput
                      value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                      placeholder="e.g. English, Hindi"
                    />
                  </Field>
                </div>

                <Field label="Headline" helper="One line, shown in search results">
                  <TextInput
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Comprehensive tax compliance and advisory services"
                  />
                </Field>

                <Field label="About">
                  <TextArea
                    rows={4}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Describe your firm, practice areas, and what clients can expect..."
                  />
                </Field>

                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-2">
                    Specialisations
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SPECIALISATIONS_LIST.map((spec) => {
                      const isSelected = selectedSpecialisations.includes(spec);
                      return (
                        <button
                          key={spec}
                          type="button"
                          onClick={() => toggleSpecialisation(spec)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors border ${
                            isSelected
                              ? "bg-foreground text-background border-foreground shadow-xs"
                              : "bg-surface-2 text-muted-foreground border-border hover:text-foreground hover:border-border-strong"
                          }`}
                        >
                          {spec}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="primary" onClick={() => toast("Listing saved.")}>
                    Save listing
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 2: Packages */}
        {tab === "Packages" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                A fixed price is the whole reason someone picks you over a phone call to three offices.
              </p>
              <Button
                variant="primary"
                onClick={handleOpenAddPackage}
                className="inline-flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="h-4 w-4" />
                Add package
              </Button>
            </div>

            <div className="space-y-3">
              {packageList.map((p) => (
                <Card key={p.id} className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-semibold text-foreground">{p.name}</h4>
                        {p.category && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-secondary text-foreground border border-border">
                            {p.category}
                          </span>
                        )}
                        {p.hidden && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed max-w-3xl">
                        {p.description}
                      </p>
                      <p className="mt-1.5 text-xs text-muted-foreground">{p.turnaround}</p>
                      <div className="mt-4 flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleOpenEditPackage(p)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setPackageList((prev) =>
                              prev.map((x) =>
                                x.id === p.id ? { ...x, hidden: !x.hidden } : x
                              )
                            );
                            toast(
                              p.hidden
                                ? "Package unhidden."
                                : "Package hidden from public view."
                            );
                          }}
                        >
                          {p.hidden ? "Unhide" : "Hide"}
                        </Button>
                        <button
                          type="button"
                          onClick={() => {
                            setPackageList((prev) => prev.filter((x) => x.id !== p.id));
                            toast("Package deleted.");
                          }}
                          title="Delete package"
                          className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-secondary rounded transition-colors inline-flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="sm:text-right shrink-0">
                      <p className="font-serif text-2xl font-medium text-foreground">
                        {formatINR(p.price)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Bookings */}
        {tab === "Bookings" && (
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                No client bookings received yet. Public marketplace inquiries will appear here.
              </Card>
            ) : (
              bookings.map((b) => (
                <Card key={b.id} className="p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{b.name}</span>
                        <Badge>{b.status}</Badge>
                        {b.status === "accepted" || b.status === "completed" ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] bg-secondary text-muted-foreground border border-border">
                            In your clients
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-1 text-[13px] text-muted-foreground">
                        {b.email} · {b.phone} · {b.city}
                      </p>
                      <p className="mt-1.5 text-[13px] text-foreground">
                        {b.service} · <span className="text-muted-foreground">{b.requestDate}</span>
                      </p>

                      {b.message ? (
                        <div className="mt-2.5 max-w-xl rounded border border-border bg-surface-2 px-3 py-2 text-[13px] text-muted-foreground">
                          {b.message}
                        </div>
                      ) : null}

                      <div className="mt-3.5 flex flex-wrap items-center gap-2">
                        {b.status === "requested" ? (
                          <>
                            <Button variant="primary" onClick={() => setStatus(b.id, "accepted")}>
                              Accept
                            </Button>
                            <Button variant="secondary" onClick={() => setStatus(b.id, "declined")}>
                              Decline
                            </Button>
                          </>
                        ) : b.status === "accepted" ? (
                          <div className="space-y-1.5">
                            <Button variant="secondary" onClick={() => setStatus(b.id, "completed")}>
                              Mark complete
                            </Button>
                            <p className="text-[11px] text-muted-foreground">
                              Marking it complete is what lets the client leave a review.
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <p className="font-serif text-2xl font-medium text-foreground">
                        {formatINR(b.amount)}
                      </p>
                      <p className="mt-0.5 text-[12px] text-muted-foreground">
                        {formatINR(b.platformFee)} platform fee
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        from the client, not you · not charged yet
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Reviews */}
        {tab === "Reviews" && (
          <div className="space-y-3">
            {reviews.map((r) => (
              <Card key={r.id} className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-amber-400 text-sm tracking-tighter">
                      {"★".repeat(r.rating)}
                    </span>
                    <span className="font-semibold text-foreground">
                      {Number(r.rating).toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {r.author} · {r.date}
                  </p>
                </div>
                {r.title && (
                  <h4 className="mt-2.5 text-sm font-semibold text-foreground">{r.title}</h4>
                )}
                <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">{r.text}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Package Modal */}
      <Modal
        open={packageModalOpen}
        onClose={() => setPackageModalOpen(false)}
        title={editingPackage ? "Edit package" : "Add package"}
        description="Configure fixed-price service package for the public marketplace."
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setPackageModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSavePackage}>
              {editingPackage ? "Save changes" : "Create package"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 p-4">
          <Field label="Package name" required>
            <TextInput
              value={pkgName}
              onChange={(e) => setPkgName(e.target.value)}
              placeholder="e.g. Private Limited Company Registration"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <TextInput
                value={pkgCategory}
                onChange={(e) => setPkgCategory(e.target.value)}
                placeholder="e.g. Company Registration"
              />
            </Field>
            <Field label="Price (₹)" required>
              <TextInput
                type="number"
                value={pkgPrice}
                onChange={(e) => setPkgPrice(e.target.value)}
                placeholder="15000"
              />
            </Field>
          </div>
          <Field label="Turnaround timeline">
            <TextInput
              value={pkgTurnaround}
              onChange={(e) => setPkgTurnaround(e.target.value)}
              placeholder="e.g. Usually 12 days"
            />
          </Field>
          <Field label="Description">
            <TextArea
              rows={3}
              value={pkgDescription}
              onChange={(e) => setPkgDescription(e.target.value)}
              placeholder="What is included in this package..."
            />
          </Field>
        </div>
      </Modal>
    </>
  );
}
