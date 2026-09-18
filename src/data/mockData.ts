export type Client = {
  id: string;
  name: string;
  type: string;
  kycEntityType?: string;
  pan: string;
  gstin?: string;
  email?: string;
  phone?: string;
  services: string[];
  isAuditCase?: boolean;
  agmDate?: string;
  notes?: string;
};

export type Deadline = {
  id: string;
  task: string;
  service: string;
  period: string;
  client: string;
  daysOverdue: number;
  dueDate: string;
  status: "Overdue" | "In Progress" | "Filed" | "Open";
};

export type DocRequest = {
  id: string;
  title: string;
  client: string;
  received: string;
  expires: string;
  status: "Completed" | "Open" | "Expired";
};

export type Fee = {
  id: string;
  forWhat: string;
  service: string;
  client: string;
  amount: number;
  due: string;
  status: "Invoiced" | "Paid" | "Overdue" | "Draft";
};

export type TdsReturn = {
  id: string;
  client: string;
  quarter: string;
  form: string;
  tdsTotal: number;
  flags: number;
  status: string;
};

export type Audit = {
  id: string;
  client: string;
  audit: string;
  year: string;
  done: number;
  total: number;
  assigned: string;
  due: string;
  status: string;
};

export type TaxAlert = {
  id: string;
  client: string;
  ay: string;
  text: string;
  date: string;
  seen: boolean;
};

export type AdvanceEstimate = {
  id: string;
  client: string;
  fy: string;
  estimated: number;
  paid: number;
  nextDue: string;
  status: string;
};

export type NoticeMatter = {
  id: string;
  title: string;
  noticeType: string;
  client: string;
  drafted: string;
  status: "Received" | "Draft";
  amount?: number;
};

export type EmailDraft = {
  id: string;
  client: string;
  topic: string;
  subject: string;
  body: string;
  createdAt: string;
};

export type Recon = {
  id: string;
  client: string;
  month: string;
  matched: number;
  mismatched: number;
  missing: number;
  registerTotal: number;
  portalTotal: number;
};

export type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  service: string;
  requestDate: string;
  amount: number;
  platformFee: number;
  message?: string;
  status: "requested" | "accepted" | "declined" | "completed";
};

export type Package = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  turnaround: string;
  includes?: string[];
  hidden?: boolean;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  title?: string;
  text: string;
};

export const CLIENT_TYPES = [
  "Individual",
  "Partnership Firm",
  "Company",
  "LLP",
  "HUF",
  "Trust",
];

export const KYC_ENTITY_TYPES = [
  "Individual / Proprietor",
  "Partnership Firm",
  "Private Limited Company",
  "LLP",
  "HUF",
  "Trust / Society",
];

export const SERVICES = [
  "ITR",
  "GSTR-1",
  "GSTR-3B",
  "TDS",
  "ROC",
  "Company Registration",
  "Advance Tax",
  "Other",
];

export const NOTICE_TYPES = [
  "143(1) intimation",
  "143(2) scrutiny",
  "148 reassessment",
  "GST audit",
  "GST ASMT-10",
  "TDS default notice",
  "Other",
];

export const AUDIT_TYPES = ["Tax", "Statutory", "GST", "Internal"];
export const FINANCIAL_YEARS = ["FY2026-27", "FY2025-26", "FY2024-25"];
export const QUARTERS = [
  "Q1 FY2026-27",
  "Q2 FY2026-27",
  "Q3 FY2026-27",
  "Q4 FY2026-27",
];
export const TDS_FORMS = ["24Q — Salary", "26Q — Non-salary"];

export const EMAIL_TOPICS = [
  "GST filing reminder",
  "Document request follow-up",
  "Fee outstanding reminder",
  "Income tax demand update",
  "Advance tax installment reminder",
];

export const clients: Client[] = [
  {
    id: "c1",
    name: "Anand Provision Stores",
    type: "Partnership Firm",
    pan: "AAIFA5678V",
    gstin: "27AAIFA5678V1Z2",
    email: "accounts@anandprovision.example",
    phone: "98200 11223",
    services: ["GSTR-1", "GSTR-3B"],
  },
  {
    id: "c2",
    name: "Deccan Logistics Pvt Ltd",
    type: "Company",
    pan: "AAKC03456Y",
    gstin: "27AAKC03456Y1Z7",
    email: "finance@deccanlogistics.example",
    phone: "98201 44556",
    services: ["GSTR-1", "GSTR-3B", "ROC"],
  },
  {
    id: "c3",
    name: "Ganesh Steel Works",
    type: "Partnership Firm",
    pan: "AAGFG8901T",
    gstin: "27AAGFG8901T1Z9",
    email: "ganeshsteel@example.com",
    phone: "98220 33445",
    services: ["GSTR-1", "GSTR-3B", "TDS"],
  },
  {
    id: "c4",
    name: "Kavita Desai",
    type: "Individual",
    pan: "ABCPD1234M",
    email: "kavita.desai@example.com",
    phone: "98330 55667",
    services: ["ITR"],
  },
  {
    id: "c5",
    name: "Konark Foods",
    type: "Partnership Firm",
    pan: "AAEFK2345L",
    gstin: "27AAEFK2345L1Z3",
    email: "hello@konarkfoods.example",
    phone: "98450 22110",
    services: ["GSTR-1", "GSTR-3B"],
  },
  {
    id: "c6",
    name: "Meera Kulkarni",
    type: "Individual",
    pan: "BNZPK3456S",
    email: "meera.kulkarni@example.com",
    phone: "98670 12345",
    services: ["ITR"],
  },
  {
    id: "c7",
    name: "Nikhil Joshi",
    type: "Individual",
    pan: "AKJPJ9012P",
    email: "nikhil.joshi@example.com",
    phone: "97300 45678",
    services: ["ITR", "TDS"],
  },
  {
    id: "c8",
    name: "Orbit Software Solutions",
    type: "Company",
    pan: "AAHC02345U",
    gstin: "27AAHC02345U1Z8",
    email: "cfo@orbitsoftware.example",
    phone: "98190 87654",
    services: ["GSTR-1", "GSTR-3B", "ROC", "TDS", "ITR"],
  },
  {
    id: "c9",
    name: "Patil Agro Industries",
    type: "Partnership Firm",
    pan: "AAFFP6789K",
    gstin: "27AAFFP6789K1Z4",
    email: "patilagro@example.com",
    phone: "94220 11987",
    services: ["GSTR-1", "GSTR-3B", "TDS"],
  },
  {
    id: "c10",
    name: "Sunrise Textiles Pvt Ltd",
    type: "Company",
    pan: "AADCS4567R",
    gstin: "27AADCS4567R1Z1",
    email: "accounts@sunrisetextiles.example",
    phone: "98920 65432",
    services: ["GSTR-1", "GSTR-3B", "ROC", "TDS"],
  },
  {
    id: "c11",
    name: "Wellness Pharma LLP",
    type: "LLP",
    pan: "AAWFW1234N",
    gstin: "27AAWFW1234N1Z6",
    email: "compliance@wellnesspharma.example",
    phone: "99300 22334",
    services: ["GSTR-1", "GSTR-3B", "ROC"],
  },
  {
    id: "c12",
    name: "Vaidya Healthcare LLP",
    type: "LLP",
    pan: "AAVFV5678Q",
    gstin: "27AAVFV5678Q1Z0",
    email: "admin@vaidyahealth.example",
    phone: "98860 77665",
    services: ["TDS", "GSTR-3B"],
  },
  {
    id: "c13",
    name: "Tushar Kumar",
    type: "Individual",
    pan: "AXRPK7890B",
    gstin: "27AXRPK7890B1Z5",
    email: "tushar.kumar@example.com",
    phone: "98111 23456",
    services: ["ITR", "GSTR-1", "GSTR-3B", "Company Registration"],
  },
  {
    id: "c14",
    name: "Sneha Kulkarni",
    type: "Individual",
    pan: "BKLPS3456D",
    email: "sneha.kulkarni@example.com",
    phone: "98200 44556",
    services: ["GSTR-1", "GSTR-3B"],
  },
  {
    id: "c15",
    name: "Santosh Kumar",
    type: "Individual",
    pan: "AQWPK1234F",
    email: "santosh@gmail.example",
    phone: "86534 53432",
    services: ["ITR"],
  },
  {
    id: "c16",
    name: "Rajesh Kulkarni & Sons",
    type: "HUF",
    pan: "AAHHR2345C",
    email: "rk.sons@example.com",
    phone: "98230 11445",
    services: ["ITR", "Advance Tax"],
  },
  {
    id: "c17",
    name: "Priya Sharma",
    type: "Individual",
    pan: "AFTPS6789G",
    email: "priya.sharma@example.com",
    phone: "98700 33221",
    services: ["ITR"],
  },
  {
    id: "c18",
    name: "Sanjay Bhosale",
    type: "Individual",
    pan: "AGHPB4567H",
    email: "sanjay.bhosale@example.com",
    phone: "98500 66778",
    services: ["ITR", "Advance Tax"],
  },
  {
    id: "c19",
    name: "Sumit Kumar",
    type: "Individual",
    pan: "AHJPK8901J",
    email: "sumit.kumar@example.com",
    phone: "98910 22334",
    services: ["ITR"],
  },
  {
    id: "c20",
    name: "Nashik Hardware Traders",
    type: "Partnership Firm",
    pan: "AANFN3456M",
    gstin: "27AANFN3456M1Z2",
    email: "nashikhardware@example.com",
    phone: "94030 55112",
    services: ["GSTR-1", "GSTR-3B"],
  },
  {
    id: "c21",
    name: "Shree Balaji Trust",
    type: "Trust",
    pan: "AABTS7890K",
    email: "trust@shreebalaji.example",
    phone: "98220 99887",
    services: ["ITR", "Other"],
  },
  {
    id: "c22",
    name: "Pune Coworks LLP",
    type: "LLP",
    pan: "AAPFP1234L",
    gstin: "27AAPFP1234L1Z3",
    email: "billing@punecoworks.example",
    phone: "98600 12312",
    services: ["GSTR-1", "GSTR-3B", "ROC"],
  },
];

export const deadlines: Deadline[] = [
  {
    id: "d1",
    task: "GSTR-1",
    service: "GSTR-1",
    period: "May 2026",
    client: "Tushar Kumar",
    daysOverdue: 96,
    dueDate: "11 Jun 2026",
    status: "Overdue",
  },
  {
    id: "d2",
    task: "GSTR-3B",
    service: "GSTR-3B",
    period: "May 2026",
    client: "Tushar Kumar",
    daysOverdue: 87,
    dueDate: "20 Jun 2026",
    status: "Overdue",
  },
  {
    id: "d3",
    task: "GSTR-1",
    service: "GSTR-1",
    period: "Jun 2026",
    client: "Tushar Kumar",
    daysOverdue: 66,
    dueDate: "11 Jul 2026",
    status: "Overdue",
  },
  {
    id: "d4",
    task: "GSTR-3B",
    service: "GSTR-3B",
    period: "Jun 2026",
    client: "Tushar Kumar",
    daysOverdue: 57,
    dueDate: "20 Jul 2026",
    status: "Overdue",
  },
  {
    id: "d5",
    task: "ITR filing (non-audit)",
    service: "ITR",
    period: "AY 2026-27",
    client: "Tushar Kumar",
    daysOverdue: 46,
    dueDate: "31 Jul 2026",
    status: "Overdue",
  },
  {
    id: "d6",
    task: "TDS return (26Q)",
    service: "TDS",
    period: "Q1 FY2026-27",
    client: "Ganesh Steel Works",
    daysOverdue: 46,
    dueDate: "31 Jul 2026",
    status: "In Progress",
  },
  {
    id: "d7",
    task: "GSTR-1",
    service: "GSTR-1",
    period: "Jul 2026",
    client: "Sunrise Textiles Pvt Ltd",
    daysOverdue: 35,
    dueDate: "11 Aug 2026",
    status: "Overdue",
  },
  {
    id: "d8",
    task: "GSTR-3B",
    service: "GSTR-3B",
    period: "Jul 2026",
    client: "Anand Provision Stores",
    daysOverdue: 26,
    dueDate: "20 Aug 2026",
    status: "Overdue",
  },
  {
    id: "d9",
    task: "ROC annual filing (AOC-4)",
    service: "ROC",
    period: "FY2025-26",
    client: "Orbit Software Solutions",
    daysOverdue: 12,
    dueDate: "03 Sept 2026",
    status: "Overdue",
  },
  {
    id: "d10",
    task: "TDS return (24Q)",
    service: "TDS",
    period: "Q1 FY2026-27",
    client: "Vaidya Healthcare LLP",
    daysOverdue: 8,
    dueDate: "07 Sept 2026",
    status: "In Progress",
  },
  {
    id: "d11",
    task: "GSTR-1",
    service: "GSTR-1",
    period: "Aug 2026",
    client: "Konark Foods",
    daysOverdue: 0,
    dueDate: "11 Sept 2026",
    status: "Open",
  },
  {
    id: "d12",
    task: "GSTR-3B",
    service: "GSTR-3B",
    period: "Aug 2026",
    client: "Deccan Logistics Pvt Ltd",
    daysOverdue: 0,
    dueDate: "20 Sept 2026",
    status: "Open",
  },
  {
    id: "d13",
    task: "Advance tax — 2nd installment",
    service: "Advance Tax",
    period: "FY2026-27",
    client: "Anand Provision Stores",
    daysOverdue: 0,
    dueDate: "15 Sept 2026",
    status: "Open",
  },
  {
    id: "d14",
    task: "GSTR-1",
    service: "GSTR-1",
    period: "Aug 2026",
    client: "Pune Coworks LLP",
    daysOverdue: 0,
    dueDate: "11 Sept 2026",
    status: "Open",
  },
];

export const docRequests: DocRequest[] = [
  {
    id: "r1",
    title: "Company Registration",
    client: "Tushar Kumar",
    received: "1 of 4",
    expires: "19 Sept 2026",
    status: "Completed",
  },
  {
    id: "r2",
    title: "KYC documents",
    client: "Tushar Kumar",
    received: "0 of 5",
    expires: "21 Sept 2026",
    status: "Open",
  },
  {
    id: "r3",
    title: "ITR — Salaried",
    client: "Deccan Logistics Pvt Ltd",
    received: "0 of 2",
    expires: "13 Oct 2026",
    status: "Open",
  },
  {
    id: "r4",
    title: "GST — Monthly",
    client: "Kavita Desai",
    received: "0 of 3",
    expires: "05 Oct 2026",
    status: "Open",
  },
  {
    id: "r5",
    title: "GST — Monthly",
    client: "Nikhil Joshi",
    received: "0 of 3",
    expires: "12 Sept 2026",
    status: "Expired",
  },
  {
    id: "r6",
    title: "GST documents — Aug 2026",
    client: "Sunrise Textiles Pvt Ltd",
    received: "0 of 2",
    expires: "30 Sept 2026",
    status: "Open",
  },
];

export const CHECKLISTS: Record<string, string[]> = {
  "ITR — Salaried": ["Form 16", "Bank interest certificate"],
  "GST — Monthly": ["Sales register", "Purchase register", "Bank statement"],
  "Company Registration": [
    "PAN of directors",
    "Aadhaar of directors",
    "Registered office proof",
    "Utility bill",
  ],
};

export const fees: Fee[] = [
  {
    id: "f1",
    forWhat: "ITR filing",
    service: "ITR",
    client: "Nikhil Joshi",
    amount: 1290,
    due: "—",
    status: "Invoiced",
  },
  {
    id: "f2",
    forWhat: "GST monthly retainer — Aug 2026",
    service: "GSTR-3B",
    client: "Sunrise Textiles Pvt Ltd",
    amount: 7500,
    due: "—",
    status: "Paid",
  },
  {
    id: "f3",
    forWhat: "ITR filing AY 2026-27",
    service: "ITR",
    client: "Kavita Desai",
    amount: 3500,
    due: "—",
    status: "Paid",
  },
  {
    id: "f4",
    forWhat: "ROC annual filing FY 2025-26",
    service: "ROC",
    client: "Orbit Software Solutions",
    amount: 12000,
    due: "10 Sept 2026",
    status: "Overdue",
  },
  {
    id: "f5",
    forWhat: "ITR filing AY 2026-27",
    service: "ITR",
    client: "Meera Kulkarni",
    amount: 3500,
    due: "—",
    status: "Paid",
  },
  {
    id: "f6",
    forWhat: "TDS quarterly filing Q1",
    service: "TDS",
    client: "Vaidya Healthcare LLP",
    amount: 4500,
    due: "18 Sept 2026",
    status: "Invoiced",
  },
  {
    id: "f7",
    forWhat: "GST monthly retainer — Aug 2026",
    service: "GSTR-3B",
    client: "Ganesh Steel Works",
    amount: 5500,
    due: "—",
    status: "Paid",
  },
  {
    id: "f8",
    forWhat: "Company registration advisory",
    service: "Company Registration",
    client: "Tushar Kumar",
    amount: 5000,
    due: "25 Sept 2026",
    status: "Draft",
  },
];

export const tdsReturns: TdsReturn[] = [
  {
    id: "t1",
    client: "Ganesh Steel Works",
    quarter: "Q2 FY2026-27",
    form: "26Q",
    tdsTotal: 750,
    flags: 1,
    status: "Preparation",
  },
  {
    id: "t2",
    client: "Deccan Logistics Pvt Ltd",
    quarter: "Q2 FY2026-27",
    form: "26Q",
    tdsTotal: 0,
    flags: 0,
    status: "Filed",
  },
];

export const audits: Audit[] = [
  {
    id: "a1",
    client: "Wellness Pharma LLP",
    audit: "GST",
    year: "FY2025-26",
    done: 6,
    total: 15,
    assigned: "—",
    due: "—",
    status: "Planning",
  },
  {
    id: "a2",
    client: "Kavita Desai",
    audit: "Statutory",
    year: "FY2025-26",
    done: 0,
    total: 24,
    assigned: "—",
    due: "—",
    status: "Planning",
  },
  {
    id: "a3",
    client: "Ganesh Steel Works",
    audit: "Statutory",
    year: "FY2025-26",
    done: 1,
    total: 24,
    assigned: "—",
    due: "—",
    status: "Planning",
  },
];

export const taxAlerts: TaxAlert[] = [
  {
    id: "al1",
    client: "Sumit Kumar",
    ay: "AY2025-26",
    text: "New demand of ₹18,600 under 143(1).",
    date: "08 Sept",
    seen: false,
  },
  {
    id: "al2",
    client: "Sanjay Bhosale",
    ay: "AY2024-25",
    text: "New demand of ₹74,500.50 under 154.",
    date: "07 Sept",
    seen: true,
  },
  {
    id: "al3",
    client: "Rajesh Kulkarni & Sons",
    ay: "AY2024-25",
    text: "New demand of ₹9,999 under 234C.",
    date: "07 Sept",
    seen: true,
  },
  {
    id: "al4",
    client: "Priya Sharma",
    ay: "AY2025-26",
    text: "New demand of ₹1,05,000 under 143(1).",
    date: "07 Sept",
    seen: true,
  },
  {
    id: "al5",
    client: "Meera Kulkarni",
    ay: "AY2024-25",
    text: "Return processed with no demand or refund.",
    date: "06 Sept",
    seen: true,
  },
];

export const demands = [
  { id: "dm1", client: "Sumit Kumar", ay: "AY2025-26", section: "143(1)", amount: 18600, raisedOn: "08 Sept 2026" },
  { id: "dm2", client: "Sanjay Bhosale", ay: "AY2024-25", section: "154", amount: 74500.5, raisedOn: "07 Sept 2026" },
  { id: "dm3", client: "Rajesh Kulkarni & Sons", ay: "AY2024-25", section: "234C", amount: 9999, raisedOn: "07 Sept 2026" },
  { id: "dm4", client: "Priya Sharma", ay: "AY2025-26", section: "143(1)", amount: 105000, raisedOn: "07 Sept 2026" },
  { id: "dm5", client: "Anand Provision Stores", ay: "AY2023-24", section: "143(3)", amount: 552500, raisedOn: "22 Aug 2026" },
  { id: "dm6", client: "Ganesh Steel Works", ay: "AY2024-25", section: "156", amount: 214300, raisedOn: "14 Aug 2026" },
  { id: "dm7", client: "Orbit Software Solutions", ay: "AY2024-25", section: "143(1)", amount: 187500, raisedOn: "02 Aug 2026" },
  { id: "dm8", client: "Konark Foods", ay: "AY2023-24", section: "154", amount: 89400, raisedOn: "28 Jul 2026" },
  { id: "dm9", client: "Patil Agro Industries", ay: "AY2024-25", section: "143(1)", amount: 44400, raisedOn: "19 Jul 2026" },
  { id: "dm10", client: "Nikhil Joshi", ay: "AY2025-26", section: "234B", amount: 21000, raisedOn: "11 Jul 2026" },
];

export const advanceEstimates: AdvanceEstimate[] = [
  {
    id: "ae1",
    client: "Anand Provision Stores",
    fy: "FY2025-26",
    estimated: 5000000,
    paid: 400000,
    nextDue: "All due",
    status: "Short",
  },
];

export const noticeMatters: NoticeMatter[] = [
  {
    id: "n1",
    title: "FY-2025-26 Scrutiny notice",
    noticeType: "GST audit",
    client: "Deccan Logistics Pvt Ltd",
    drafted: "06 Sept 2026, 01:10 am",
    status: "Received",
    amount: 10000,
  },
  {
    id: "n2",
    title: "143(2) scrutiny — Sunrise Textiles",
    noticeType: "—",
    client: "Sunrise Textiles Pvt Ltd",
    drafted: "05 Sept 2026, 07:46 pm",
    status: "Draft",
    amount: 0,
  },
];

export const bookings: Booking[] = [
  {
    id: "b1",
    name: "Santosh Kumar",
    email: "santosh@gmail.com",
    phone: "8653453432",
    city: "New Delhi",
    service: "ITR filing — salaried or freelancer",
    requestDate: "13 Sept 2026",
    amount: 2500,
    platformFee: 200,
    status: "requested",
  },
  {
    id: "b2",
    name: "Sneha Kulkarni",
    email: "sneha.kulkarni@example.com",
    phone: "9820044556",
    city: "Pune",
    service: "GST monthly compliance",
    requestDate: "05 Sept 2026",
    amount: 5000,
    platformFee: 400,
    message:
      "We are a 12-person design studio, just crossed the GST threshold. Need monthly filing handled from October.",
    status: "accepted",
  },
  {
    id: "b3",
    name: "Rohan Mehta",
    email: "rohan.mehta@example.com",
    phone: "9930012345",
    city: "Mumbai",
    service: "Company incorporation",
    requestDate: "01 Sept 2026",
    amount: 15000,
    platformFee: 1200,
    status: "accepted",
  },
];

export const packages: Package[] = [
  {
    id: "p1",
    name: "Private Limited Company Registration",
    category: "Company Registration",
    description: "Incorporation end to end — name approval, DIN and DSC for two directors, MOA/AOA drafting and filing.",
    price: 15000,
    turnaround: "Usually 12 days",
    includes: ["Name approval", "SPICe+ filing", "MOA/AOA drafting", "PAN, TAN & DSC"],
  },
  {
    id: "p2",
    name: "ITR filing — salaried or freelancer",
    category: "ITR",
    description: "Return preparation and filing, including capital gains and foreign income schedules where they apply.",
    price: 2500,
    turnaround: "Usually 4 days",
    includes: ["Computation review", "Return filing", "Post-filing query support"],
  },
  {
    id: "p3",
    name: "GST monthly compliance",
    category: "GSTR-3B",
    description: "GSTR-1 and GSTR-3B every month, reconciliation, and we chase you for the registers so you do not have to remember.",
    price: 5000,
    turnaround: "Usually 30 days",
    includes: ["GSTR-1 & 3B filing", "GSTR-2B reconciliation", "ITC advisory"],
  },
];

export const reviews: Review[] = [
  {
    id: "rv1",
    author: "Arjun Mehta",
    rating: 5,
    date: "05 Sept 2026",
    title: "Company registered in twelve days, exactly as quoted",
    text: "Quoted 15,000 upfront and that is what I paid — no surprise additions at the end. Explained every form before I signed it and chased the MCA when approval was slow. I have already sent two other founders to them.",
  },
];

export const team = [
  { id: "tm1", name: "Santosh Kumar", email: "santosh@caconnect.in", role: "Owner", joined: "05 Sept 2026" },
];

export const invitations = [
  { id: "iv1", email: "shashantshekhar10@gmail.com", role: "Staff", expires: "28 Sept 2026" },
  { id: "iv2", email: "santoshbe2024@gmail.com", role: "Staff", expires: "19 Sept 2026" },
  { id: "iv3", email: "team@caconnect.in", role: "Staff", expires: "19 Sept 2026" },
];

export const ROLES = ["Owner", "Manager", "Staff", "Read only"];

export function formatINR(amount: number): string {
  const fixed = Math.abs(amount % 1) > 0 ? amount.toFixed(2) : String(Math.round(amount));
  const parts = fixed.split(".");
  const whole = parts[0] ?? "";
  const dec = parts[1];
  const last3 = whole.slice(-3);
  const rest = whole.slice(0, -3);
  const grouped = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3 : last3;
  return "₹" + grouped + (dec ? "." + dec : "");
}
