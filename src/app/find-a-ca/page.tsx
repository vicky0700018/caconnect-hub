"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, Star, ChevronDown } from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { CA_PRACTICES, CAProfile } from "@/data/caDirectory";

const CITY_OPTIONS = [
  { label: "Any city", value: "all" },
  { label: "Pune", value: "pune" },
  { label: "Mumbai", value: "mumbai" },
  { label: "Delhi NCR", value: "delhi" },
  { label: "Bengaluru", value: "bengaluru" },
];

const SERVICE_OPTIONS = [
  { label: "Any service", value: "all" },
  { label: "ITR", value: "ITR" },
  { label: "GSTR-1", value: "GSTR-1" },
  { label: "GSTR-3B", value: "GSTR-3B" },
  { label: "TDS", value: "TDS" },
  { label: "ROC", value: "ROC" },
  { label: "Company Registration", value: "Company Registration" },
  { label: "Advance Tax", value: "Advance Tax" },
  { label: "Other", value: "Other" },
];

export default function FindACAPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("pune");
  const [selectedService, setSelectedService] = useState("TDS");
  const [appliedSearch, setAppliedSearch] = useState({
    term: "",
    city: "pune",
    service: "TDS",
  });

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAppliedSearch({
      term: searchTerm,
      city: selectedCity,
      service: selectedService,
    });
  };

  const filteredPractices = useMemo(() => {
    return CA_PRACTICES.filter((ca) => {
      // Filter by city
      if (appliedSearch.city !== "all") {
        if (!ca.city.toLowerCase().includes(appliedSearch.city.toLowerCase())) {
          return false;
        }
      }

      // Filter by service
      if (appliedSearch.service !== "all") {
        const hasService = ca.specialities.some((s) =>
          s.toLowerCase().includes(appliedSearch.service.toLowerCase())
        );
        if (!hasService) return false;
      }

      // Filter by keyword
      if (appliedSearch.term.trim()) {
        const query = appliedSearch.term.toLowerCase();
        const matchesName = ca.name.toLowerCase().includes(query);
        const matchesTagline = ca.tagline.toLowerCase().includes(query);
        const matchesService = ca.specialities.some((s) =>
          s.toLowerCase().includes(query)
        );
        const matchesCity = ca.city.toLowerCase().includes(query);
        if (!matchesName && !matchesTagline && !matchesService && !matchesCity) {
          return false;
        }
      }

      return true;
    });
  }, [appliedSearch]);

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0d13] text-[#f3f4f6] selection:bg-[#f59e0b] selection:text-black">
      <PublicHeader activeNav="find-a-ca" />

      {/* Main Content */}
      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Hero Section */}
          <div className="text-center">
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#f59e0b] uppercase">
              VERIFIED PRACTICES
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Find a CA you can trust
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#9ca3af]">
              Real Chartered Accountants, upfront prices, and reviews written only by people who actually hired them. No calls to three offices to find out what something costs.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center gap-2 rounded-lg bg-[#12141d] p-2 border border-[#232736] shadow-2xl sm:flex-nowrap"
          >
            {/* Keyword Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#6b7280]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name or speciality"
                style={{ paddingLeft: "2.5rem" }}
                className="w-full rounded-md bg-[#181a24] border border-[#232736] py-2 pr-3 text-xs text-white placeholder-[#6b7280] focus:border-[#f59e0b] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
              />
            </div>

            {/* City Dropdown */}
            <div className="relative min-w-[130px]">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full appearance-none rounded-md bg-[#181a24] border border-[#232736] py-2 pl-3 pr-8 text-xs text-white focus:border-[#f59e0b] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
              >
                {CITY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value} className="bg-[#12141d] text-white">
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#6b7280]" />
            </div>

            {/* Service Dropdown */}
            <div className="relative min-w-[140px]">
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full appearance-none rounded-md bg-[#181a24] border border-[#232736] py-2 pl-3 pr-8 text-xs text-white focus:border-[#f59e0b] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
              >
                {SERVICE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value} className="bg-[#12141d] text-white">
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#6b7280]" />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full sm:w-auto rounded-md bg-[#f59e0b] hover:bg-[#d97706] px-5 py-2 text-xs font-semibold text-black transition-colors"
            >
              Search
            </button>
          </form>

          {/* Results Count */}
          <div className="mx-auto mt-8 max-w-3xl">
            <p className="text-xs text-[#9ca3af]">
              {filteredPractices.length === 1
                ? "1 CA found"
                : `${filteredPractices.length} CAs found`}
            </p>

            {/* Practices List */}
            <div className="mt-4 space-y-4">
              {filteredPractices.length > 0 ? (
                filteredPractices.map((ca) => (
                  <div
                    key={ca.slug}
                    className="rounded-xl border border-[#232736] bg-[#12141d] p-5 transition-all hover:border-[#33384a]"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div className="space-y-1.5">
                        <Link
                          href={`/ca/${ca.slug}`}
                          className="text-base font-semibold text-white hover:text-[#f59e0b] transition-colors"
                        >
                          {ca.name}
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
                          <MapPin className="size-3.5 text-[#9ca3af]" />
                          <span>{ca.location}</span>
                        </div>
                        <p className="text-xs text-[#9ca3af] leading-relaxed">
                          {ca.tagline}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1 pt-1">
                          <div className="flex items-center text-[#f59e0b]">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="size-3.5 fill-current" />
                            ))}
                          </div>
                          <span className="text-xs font-medium text-white ml-1">
                            {ca.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-[#6b7280]">
                            ({ca.reviewCount} {ca.reviewCount === 1 ? "review" : "reviews"})
                          </span>
                        </div>

                        {/* Speciality Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {ca.specialities.map((spec) => (
                            <span
                              key={spec}
                              className="rounded bg-[#1c202d] border border-[#2b3145] px-2 py-0.5 text-[11px] font-mono text-[#9ca3af]"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="mt-5 flex items-center justify-between border-t border-[#1c202d] pt-3.5">
                      <span className="text-xs text-[#9ca3af]">
                        from <span className="font-semibold text-white">{ca.startingPrice}</span>
                      </span>
                      <Link
                        href={`/ca/${ca.slug}`}
                        className="rounded-md border border-[#2b3145] bg-[#1a1d28] hover:bg-[#232736] px-3.5 py-1.5 text-xs font-medium text-white transition-colors"
                      >
                        View profile
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-[#232736] p-8 text-center">
                  <p className="text-sm text-[#9ca3af]">No verified CAs match your search.</p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCity("all");
                      setSelectedService("all");
                      setAppliedSearch({ term: "", city: "all", service: "all" });
                    }}
                    className="mt-3 text-xs font-medium text-[#f59e0b] hover:underline"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
