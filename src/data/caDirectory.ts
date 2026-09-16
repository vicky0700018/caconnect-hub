export interface CAPackage {
  id: string;
  name: string;
  description: string;
  price?: string;
}

export interface CAProfile {
  slug: string;
  name: string;
  tagline: string;
  city: string;
  state: string;
  location: string;
  experience: string;
  icaiNumber: string;
  languages: string;
  rating: number;
  reviewCount: number;
  specialities: string[];
  startingPrice: string;
  about: string;
  packages: CAPackage[];
}

export const CA_PRACTICES: CAProfile[] = [
  {
    slug: "deshpande-associates-pune",
    name: "Deshpande & Associates",
    tagline: "GST, ITR and company compliance for Pune small businesses",
    city: "Pune",
    state: "Maharashtra",
    location: "Pune, Maharashtra",
    experience: "12 years",
    icaiNumber: "ICAI 148902",
    languages: "Marathi, Hindi, English",
    rating: 5.0,
    reviewCount: 1,
    specialities: ["ITR", "GSTR-1", "GSTR-3B", "ROC", "Company Registration"],
    startingPrice: "₹2,500",
    about:
      "A three-person practice in Kothrud, Pune. We work with 60+ small businesses and freelancers across GST, income tax and ROC compliance. Straight answers, fixed prices, and we tell you before a deadline, not after.",
    packages: [
      {
        id: "pkg-1",
        name: "Private Limited Company Registration",
        description:
          "Incorporation end to end — name approval, DIN and DSC for two directors, MOA/AOA drafting and filing.",
        price: "₹7,500",
      },
      {
        id: "pkg-2",
        name: "GST Registration & First Quarter Compliance",
        description:
          "Application filing, clarification handling, GSTIN certificate generation and GSTR-1/3B filing for first 3 months.",
        price: "₹3,500",
      },
      {
        id: "pkg-3",
        name: "Annual ITR Filing for Business / Freelancers",
        description:
          "Computation of total income, P&L & Balance Sheet prep under 44AD/44ADA, AIS/TIS reconciliation and e-filing.",
        price: "₹2,500",
      },
      {
        id: "pkg-4",
        name: "ROC Annual Filing & Compliance Retainer",
        description:
          "Preparation and filing of AOC-4, MGT-7, director KYC verification and board resolution documentation.",
        price: "₹5,000",
      },
    ],
  },
  {
    slug: "rautela-associates-pune",
    name: "Rautela & Associates",
    tagline: "Corporate tax audits, TDS compliance and IT scrutiny representations",
    city: "Pune",
    state: "Maharashtra",
    location: "Pune, Maharashtra",
    experience: "14 years",
    icaiNumber: "ICAI 129401",
    languages: "Marathi, Hindi, English",
    rating: 4.9,
    reviewCount: 4,
    specialities: ["ITR", "Advance Tax", "TDS", "ROC"],
    startingPrice: "₹3,000",
    about:
      "Established chartered accountancy firm providing high-integrity tax consultancy, statutory audits and comprehensive direct tax management for SMEs and mid-market firms.",
    packages: [
      {
        id: "pkg-r1",
        name: "Tax Audit under Section 44AB",
        description:
          "Comprehensive book scrutiny, 3CA/3CD reporting, Form 3CD upload and e-verification with authorities.",
        price: "₹12,000",
      },
      {
        id: "pkg-r2",
        name: "Quarterly TDS 24Q / 26Q Filing",
        description:
          "Deductee PAN validation, challan mapping, 206AA checks and Form 16A generation.",
        price: "₹3,000",
      },
    ],
  },
  {
    slug: "v-sharma-mumbai",
    name: "V. Sharma & Co.",
    tagline: "GST Reconciliation, input tax credit optimization and Corporate Tax",
    city: "Mumbai",
    state: "Maharashtra",
    location: "Mumbai, Maharashtra",
    experience: "18 years",
    icaiNumber: "ICAI 098412",
    languages: "Hindi, English, Gujarati",
    rating: 5.0,
    reviewCount: 6,
    specialities: ["GSTR-1", "GSTR-3B", "TDS", "Advance Tax"],
    startingPrice: "₹3,500",
    about:
      "Senior partner practice with 18+ years experience serving trading, manufacturing and service businesses in BKC and South Mumbai.",
    packages: [
      {
        id: "pkg-s1",
        name: "Monthly GST Retainer & 2B Matching",
        description:
          "Reconcile monthly purchase register with GSTR-2B JSON, vendor communication and GSTR-3B return submission.",
        price: "₹3,500",
      },
    ],
  },
  {
    slug: "sthambh-alliance-bengaluru",
    name: "Sthambh Alliance LLP",
    tagline: "Startup incorporation, ESOP tax advisory and ROC annual compliance",
    city: "Bengaluru",
    state: "Karnataka",
    location: "Bengaluru, Karnataka",
    experience: "9 years",
    icaiNumber: "ICAI 163219",
    languages: "English, Kannada, Hindi",
    rating: 4.8,
    reviewCount: 3,
    specialities: ["Company Registration", "ROC", "ITR", "TDS"],
    startingPrice: "₹4,000",
    about:
      "Tech-forward CA practice helping early-stage founders and funded startups stay 100% compliant without administrative headaches.",
    packages: [
      {
        id: "pkg-st1",
        name: "Startup Launch Compliance Bundle",
        description:
          "Pvt Ltd Incorporation, GSTIN, MSME, Startup India DPIIT recognition and first year ROC filings.",
        price: "₹15,000",
      },
    ],
  },
  {
    slug: "khandelwal-gupta-delhi",
    name: "Khandelwal & Gupta",
    tagline: "Direct tax litigation, IT notices, Section 148 appeals and scrutiny",
    city: "Delhi NCR",
    state: "Delhi",
    location: "New Delhi, Delhi NCR",
    experience: "22 years",
    icaiNumber: "ICAI 084120",
    languages: "Hindi, English",
    rating: 5.0,
    reviewCount: 9,
    specialities: ["ITR", "Advance Tax", "ROC", "Other"],
    startingPrice: "₹5,000",
    about:
      "Specialised tax counsel representing corporate and individual clients before CIT(Appeals), assessing officers and faceless assessment units.",
    packages: [
      {
        id: "pkg-kg1",
        name: "Income Tax Notice Representation",
        description:
          "Detailed reply drafting, legal case law citation and online faceless e-submission.",
        price: "₹7,500",
      },
    ],
  },
];
