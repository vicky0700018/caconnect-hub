"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Clock,
  FileCheck2,
  Globe,
  Star,
  ChevronDown,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { CA_PRACTICES, CAProfile } from "@/data/caDirectory";

export default function CAPracticeProfilePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  // Find practice by slug or fallback to Deshpande & Associates
  const practice: CAProfile =
    CA_PRACTICES.find((p) => p.slug === slug) || CA_PRACTICES[0];

  // Consultation Form State
  const [needType, setNeedType] = useState("Not sure yet — just an enquiry");
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState(practice.city || "");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Save enquiry to marketplace lead / booking endpoint if available
      await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          service: needType,
          budget: practice.startingPrice,
          phone: phone.trim(),
          email: email.trim(),
          city: city.trim(),
          notes: details.trim(),
          practiceName: practice.name,
          practiceSlug: practice.slug,
        }),
      }).catch(() => null);

      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0d13] text-[#f3f4f6] selection:bg-[#f59e0b] selection:text-black">
      <PublicHeader activeNav="find-a-ca" />

      {/* Main Container */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Breadcrumb / Back */}
          <div className="mb-6">
            <Link
              href="/find-a-ca"
              className="inline-flex items-center gap-1.5 text-xs text-[#9ca3af] hover:text-white transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to all verified CAs</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Left Column: Practice Overview & Packages */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-8">
              {/* Practice Header Info */}
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  {practice.name}
                </h1>
                <p className="mt-2 text-sm text-[#9ca3af] leading-relaxed">
                  {practice.tagline}
                </p>

                {/* Metadata Row */}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#9ca3af]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-[#9ca3af]" />
                    {practice.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-[#9ca3af]" />
                    {practice.experience}
                  </span>
                  <span className="flex items-center gap-1.5 font-mono">
                    <FileCheck2 className="size-3.5 text-[#9ca3af]" />
                    {practice.icaiNumber}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Globe className="size-3.5 text-[#9ca3af]" />
                    {practice.languages}
                  </span>
                </div>

                {/* Rating */}
                <div className="mt-3 flex items-center gap-1">
                  <div className="flex items-center text-[#f59e0b]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-white ml-1.5">
                    {practice.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-[#6b7280]">
                    ({practice.reviewCount}{" "}
                    {practice.reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </div>

                {/* Specialises In */}
                <div className="mt-6">
                  <p className="text-[11px] font-bold tracking-wider text-[#9ca3af] uppercase">
                    SPECIALISES IN
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {practice.specialities.map((spec) => (
                      <span
                        key={spec}
                        className="rounded bg-[#1c202d] border border-[#2b3145] px-2.5 py-1 text-xs font-mono text-[#cbd5e1]"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="border-t border-[#1f2433] pt-6">
                <h2 className="text-base font-bold text-white">About</h2>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#9ca3af]">
                  {practice.about}
                </p>
              </div>

              {/* Fixed Price Packages Section */}
              <div className="border-t border-[#1f2433] pt-6">
                <h2 className="text-base font-bold text-white">
                  Fixed price packages
                </h2>
                <p className="mt-1 text-xs text-[#9ca3af]">
                  The price you see is the price you pay.
                </p>

                <div className="mt-4 space-y-4">
                  {practice.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="rounded-lg border border-[#232736] bg-[#12141d] p-4 transition-colors hover:border-[#33384a]"
                    >
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                        <div>
                          <h3 className="text-sm font-semibold text-white">
                            {pkg.name}
                          </h3>
                          <p className="mt-1 text-xs text-[#9ca3af] leading-relaxed">
                            {pkg.description}
                          </p>
                        </div>
                        {pkg.price ? (
                          <span className="shrink-0 text-xs font-semibold text-[#f59e0b]">
                            {pkg.price}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Request a Consultation Form */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-24 rounded-xl border border-[#232736] bg-[#12141d] p-6 shadow-2xl">
                <h3 className="text-base font-bold text-white">
                  Request a consultation
                </h3>
                <p className="mt-1 text-xs text-[#9ca3af] leading-relaxed">
                  No account needed. {practice.name} replies to you directly.
                </p>

                {submitted ? (
                  <div className="mt-6 rounded-lg bg-[#064e3b]/30 border border-[#059669]/50 p-5 text-center">
                    <CheckCircle2 className="mx-auto size-8 text-[#10b981]" />
                    <h4 className="mt-2 text-sm font-semibold text-white">
                      Consultation Request Sent
                    </h4>
                    <p className="mt-1 text-xs text-[#a7f3d0]">
                      Thank you! {practice.name} will reach out to you at {email}{" "}
                      within 24 business hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setDetails("");
                      }}
                      className="mt-4 text-xs text-[#10b981] underline hover:text-white"
                    >
                      Send another enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
                    {/* What do you need? */}
                    <div>
                      <label className="block text-xs font-medium text-[#d1d5db] mb-1">
                        What do you need?
                      </label>
                      <div className="relative">
                        <select
                          value={needType}
                          onChange={(e) => setNeedType(e.target.value)}
                          className="w-full appearance-none rounded-md bg-[#181a24] border border-[#282d3d] px-3 py-2 text-xs text-white focus:border-[#f59e0b] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
                        >
                          <option value="Not sure yet — just an enquiry" className="bg-[#12141d]">
                            Not sure yet — just an enquiry
                          </option>
                          <option value="Private Limited Company Registration" className="bg-[#12141d]">
                            Private Limited Company Registration
                          </option>
                          <option value="GST Registration & Filing" className="bg-[#12141d]">
                            GST Registration & Filing
                          </option>
                          <option value="Annual ITR Filing" className="bg-[#12141d]">
                            Annual ITR Filing
                          </option>
                          <option value="Quarterly TDS Compliance" className="bg-[#12141d]">
                            Quarterly TDS Compliance
                          </option>
                          <option value="ROC Annual Compliance" className="bg-[#12141d]">
                            ROC Annual Compliance
                          </option>
                          <option value="Advance Tax / Notice Consultation" className="bg-[#12141d]">
                            Advance Tax / Notice Consultation
                          </option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#6b7280]" />
                      </div>
                    </div>

                    {/* Your Name */}
                    <div>
                      <label className="block text-xs font-medium text-[#d1d5db] mb-1">
                        Your name <span className="text-[#ef4444]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Ramesh Kulkarni"
                        className="w-full rounded-md bg-[#181a24] border border-[#282d3d] px-3 py-2 text-xs text-white placeholder-[#525866] focus:border-[#f59e0b] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-[#d1d5db] mb-1">
                        Email <span className="text-[#ef4444]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ramesh@company.in"
                        className="w-full rounded-md bg-[#181a24] border border-[#282d3d] px-3 py-2 text-xs text-white placeholder-[#525866] focus:border-[#f59e0b] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-medium text-[#d1d5db] mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-md bg-[#181a24] border border-[#282d3d] px-3 py-2 text-xs text-white placeholder-[#525866] focus:border-[#f59e0b] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs font-medium text-[#d1d5db] mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Pune"
                        className="w-full rounded-md bg-[#181a24] border border-[#282d3d] px-3 py-2 text-xs text-white placeholder-[#525866] focus:border-[#f59e0b] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
                      />
                    </div>

                    {/* What do you need help with? */}
                    <div>
                      <label className="block text-xs font-medium text-[#d1d5db] mb-1">
                        What do you need help with?
                      </label>
                      <textarea
                        rows={3}
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="A sentence or two is plenty."
                        className="w-full resize-none rounded-md bg-[#181a24] border border-[#282d3d] px-3 py-2 text-xs text-white placeholder-[#525866] focus:border-[#f59e0b] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
                      />
                    </div>

                    {/* Send Request Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-md bg-[#b45309] hover:bg-[#92400e] py-2.5 text-xs font-semibold text-white shadow-md transition-colors disabled:opacity-50"
                    >
                      {submitting ? "Sending..." : "Send request"}
                    </button>

                    <p className="pt-1 text-center text-[11px] text-[#6b7280]">
                      Your details go to {practice.name} only.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
