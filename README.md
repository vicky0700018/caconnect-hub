# CAConnect Hub

============================================================
IMPORTANT — WORK ON THIS EXISTING GITHUB REPOSITORY
============================================================

GITHUB REPOSITORY:

https://github.com/vicky0700018/practice-hub-pro-ada7f05e

This is an EXISTING project.

DO NOT create a new project.

DO NOT rebuild the application from scratch.

DO NOT replace the existing application.

Open/continue working on THIS existing repository and preserve everything that is already implemented.

============================================================
MAIN TASK
============================================================

I want to add a PUBLIC CAConnect LANDING PAGE and a FRONTEND-ONLY LOGIN FLOW before the EXISTING dashboard.

The final flow must be:

PUBLIC LANDING PAGE
        ↓
LOGIN
        ↓
EXISTING DASHBOARD
        ↓
LOGOUT
        ↓
PUBLIC LANDING PAGE

The existing dashboard is already built.

============================================================
VERY IMPORTANT — DO NOT MODIFY THE EXISTING DASHBOARD
============================================================

THE EXISTING LOGGED-IN DASHBOARD IS ALREADY BUILT AND WORKING.

DO NOT:

- redesign the dashboard
- rebuild the dashboard
- replace the dashboard
- simplify the dashboard
- remove dashboard features
- remove any modules
- rename modules
- change existing module layouts
- change existing forms
- change existing fields
- remove existing fields
- change existing tables
- remove existing tables
- remove existing tabs
- remove existing buttons
- remove existing filters
- remove existing search functionality
- remove existing CRUD interactions
- change the existing sidebar
- change the existing header
- change existing dashboard styling
- change existing dashboard data unnecessarily
- recreate existing pages from scratch

KEEP THE EXISTING DASHBOARD EXACTLY AS IT CURRENTLY EXISTS.

The ONLY thing being added around the existing dashboard is:

1. Public landing page
2. Login page
3. Frontend-only login state
4. Login/logout navigation flow

After successful login, open the EXISTING dashboard exactly as it currently exists.

DO NOT create a second/new dashboard.

============================================================
REFERENCE WEBSITE
============================================================

Use this website as the visual reference:

https://www.bevritti.in/

The reference website is for visual design, layout and UX inspiration only.

DO NOT copy source code.

DO NOT copy website implementation.

Recreate the overall visual language using our own React components.

============================================================
TECHNOLOGY — MUST FOLLOW
============================================================

Use ONLY:

- React
- Vite
- Tailwind CSS
- React state
- Browser localStorage

Do NOT introduce additional technologies or libraries.

DO NOT use:

- Supabase
- Firebase
- MongoDB
- PostgreSQL
- Prisma
- Express
- Node backend
- API server
- external API
- Auth0
- Clerk
- external authentication
- Redux
- Zustand
- React Router
- any routing library
- any new UI/component library
- Material UI
- Chakra UI
- Ant Design
- Bootstrap
- Lucide
- Font Awesome
- Heroicons
- any unnecessary npm package

Use React state-based page switching for the public page/login/dashboard flow.

Use existing project dependencies only where already required.

DO NOT add unnecessary dependencies.

============================================================
1. PUBLIC LANDING PAGE — FIRST SCREEN
============================================================

When a user opens the website for the first time:

SHOW THE PUBLIC LANDING PAGE.

DO NOT directly show the dashboard.

The landing page should have the same overall premium feel as the Bevritti / CAConnect reference website.

Design:

- Dark/black background
- Premium SaaS appearance
- CA practice-management branding
- White/off-white typography
- Orange/golden accent
- Thin subtle borders
- Professional spacing
- Clean buttons
- Modern but minimal design
- Responsive
- Desktop/tablet/mobile

============================================================
2. LANDING PAGE HEADER
============================================================

Header:

LEFT:

CAConnect logo
CAConnect

RIGHT:

Find a CA
How it works
Pricing
Log in
Start free

"Log in" must open the login page.

"Start free" should open the same frontend demo login/entry flow.

============================================================
3. HERO SECTION
============================================================

Use the following content:

Eyebrow:

PRACTICE MANAGEMENT FOR INDIAN CA FIRMS

Heading:

Run your CA firm
without the chaos

Supporting text:

Client deadlines, document collection, GST reconciliation, fee tracking and AI-drafted IT notice replies — in one place, built for firms of one to five people.

Primary CTA:

Start free — no credit card

Secondary CTA:

See how it works

Supporting text:

Free for up to 10 clients · Set up in under 5 minutes

Keep the hero visually close to the provided Bevritti/CAConnect reference.

============================================================
4. PUBLIC LANDING PAGE SECTIONS
============================================================

Add professional marketing sections inspired by the reference website.

Include:

- Hero
- Product/drafting section
- Dashboard preview section
- How it works
- Practice management modules
- Features
- Pricing
- Final CTA
- Footer

These sections are ONLY for the public marketing website.

Do not modify the actual logged-in dashboard.

============================================================
5. DRAFTING SECTION
============================================================

Add a section showing the concept of AI-assisted notice drafting.

Heading:

An hour of drafting, in half a minute

Show a UI-style mockup:

- Notice received
- Draft reply
- AI-assisted drafting concept

Use only generic placeholder/demo text.

Do not use real personal information.

============================================================
6. DASHBOARD PREVIEW SECTION
============================================================

Add a marketing section that visually previews the CA practice-management dashboard.

Heading:

What you open at nine in the morning

If possible, reuse a visual preview of the EXISTING dashboard.

IMPORTANT:

This is only a PUBLIC marketing preview.

DO NOT modify the actual logged-in dashboard.

The real dashboard must remain exactly as it already exists.

============================================================
7. PRACTICE MODULES SECTION
============================================================

Show cards for:

Client register
Compliance calendar
Document collection & KYC
GST 2A/2B reconciliation
TDS return workflow
Audit workpapers & checklists
Notice tracker
Income Tax status
Fee register
Advance Tax
Client Emails
Team
Marketplace

Use short professional descriptions.

============================================================
8. HOW IT WORKS
============================================================

Create a simple 3-step section:

01
Add your clients

02
Track compliance, documents and fees

03
Run the firm from one place

============================================================
9. PRICING
============================================================

Create a frontend-only pricing section inspired by the reference website.

Example plans:

Starter
Free

Solo
₹999/mo

Pro
₹1,999/mo

Team
₹2,999/mo

Show feature comparisons.

IMPORTANT:

This is only marketing UI.

Do NOT add:

- payment gateway
- subscription backend
- real billing
- payment API

============================================================
10. FINAL CTA
============================================================

Heading:

Ready to run your CA firm without the chaos?

Button:

Start free

Button opens the frontend login flow.

============================================================
11. FOOTER
============================================================

Footer:

CAConnect

Built for Indian CA firms

Find a CA
How it works
Pricing
Log in

© 2026 CAConnect · Built for Indian CA firms

============================================================
12. LOGIN PAGE
============================================================

Create a professional CAConnect login page.

Use the same dark premium visual style.

Title:

Welcome back

Subtitle:

Sign in to your CA practice

Fields:

Email
Password

Button:

Sign in

Also show:

Use Demo Credentials

Demo credentials:

Email:
demo@caconnect.com

Password:
demo123

============================================================
13. LOGIN FUNCTIONALITY
============================================================

This is FRONTEND-ONLY demo authentication.

When user enters:

Email:
demo@caconnect.com

Password:
demo123

Allow login.

Then:

→ save login state in localStorage
→ open the EXISTING dashboard

Example localStorage key:

caconnect_demo_logged_in

If credentials are incorrect:

Show:

Invalid email or password

Do NOT connect to any backend.

Do NOT use any authentication service.

============================================================
14. LOGIN PERSISTENCE
============================================================

If the user is logged in:

Refreshing the browser must keep them logged in.

If the user is logged out:

Refreshing the browser must show the public landing page.

Use browser localStorage only.

============================================================
15. LOGOUT
============================================================

Use the EXISTING logout functionality if already available.

When Logout is clicked:

1. Clear the demo login state.
2. Return to the public landing page.
3. Do not show the dashboard.

============================================================
16. EXISTING DASHBOARD — ABSOLUTELY PRESERVE
============================================================

After successful login:

OPEN THE EXISTING DASHBOARD.

DO NOT BUILD A NEW DASHBOARD.

DO NOT MODIFY THE EXISTING DASHBOARD.

The existing dashboard must remain exactly as it currently looks and works.

Preserve:

- sidebar
- header
- cards
- tables
- forms
- modals
- buttons
- tabs
- filters
- search
- status badges
- actions
- existing page layouts
- existing mock data
- existing interactions
- existing responsive behavior

============================================================
17. EXISTING SIDEBAR — PRESERVE EXACTLY
============================================================

Keep the existing sidebar and all modules:

Dashboard
Clients
Deadlines
Documents
Fees
TDS Returns
Audits
Income Tax
Advance Tax
Notice Tracker
GST Reconciliation
Client Emails
Team
Marketplace

DO NOT remove or rename anything.

============================================================
18. EXISTING MODULES — DO NOT REBUILD
============================================================

All these existing pages are already implemented.

Keep them exactly as they are:

1. Dashboard
2. Clients
3. Deadlines
4. Documents
5. Fees
6. TDS Returns
7. Audits
8. Income Tax
9. Advance Tax
10. Notice Tracker
11. GST Reconciliation
12. Client Emails
13. Team
14. Marketplace

Do not recreate these pages from scratch.

============================================================
19. EXISTING DATA — PRESERVE DASHBOARD
============================================================

IMPORTANT:

The current repository already contains the existing dashboard and its mock/demo data.

DO NOT delete or restructure the existing dashboard data just for this task.

The main task is to add the public landing page and login flow.

Do not add additional screenshot example data.

Do not replace existing dashboard data with new fake data.

Preserve the current working dashboard.

============================================================
20. NO DATABASE / NO BACKEND
============================================================

This remains a frontend-only application.

No:

- database
- backend
- API
- external service
- authentication server

Only:

React
Vite
Tailwind CSS
React state
localStorage

============================================================
21. DO NOT BREAK THE CURRENT PROJECT
============================================================

Before making changes:

Inspect the existing project.

Understand the current components and page structure.

Reuse existing components wherever possible.

Do not unnecessarily rewrite files.

Do not replace working components.

Do not remove working functionality.

Do not change the dashboard unless absolutely required to connect the login state.

Only add the minimum code necessary for:

PUBLIC LANDING PAGE
+
LOGIN
+
LOGIN STATE
+
LOGOUT FLOW

============================================================
22. RESPONSIVE
============================================================

Public landing page:

- Desktop
- Tablet
- Mobile

Login page:

- Desktop
- Tablet
- Mobile

Existing dashboard:

KEEP ITS CURRENT RESPONSIVE DESIGN.

Do not break it.

============================================================
23. FINAL USER FLOW
============================================================

The final application MUST work exactly like this:

USER OPENS:

CAConnect Public Landing Page

        ↓

Clicks:

Log in

        ↓

LOGIN PAGE

        ↓

Email:
demo@caconnect.com

Password:
demo123

        ↓

Sign in

        ↓

EXISTING CAConnect DASHBOARD

        ↓

All existing modules work normally

        ↓

Logout

        ↓

CAConnect Public Landing Page

============================================================
24. NON-NEGOTIABLE REQUIREMENT
============================================================

DO NOT MODIFY THE EXISTING DASHBOARD.

DO NOT REBUILD THE EXISTING DASHBOARD.

DO NOT REDESIGN THE EXISTING DASHBOARD.

DO NOT REMOVE EXISTING MODULES.

DO NOT REMOVE EXISTING DATA.

DO NOT REMOVE EXISTING FUNCTIONALITY.

ONLY ADD THE PUBLIC LANDING PAGE + LOGIN FLOW BEFORE THE EXISTING DASHBOARD.

Work inside this repository:

https://github.com/vicky0700018/practice-hub-pro-ada7f05e

Final structure:

CAConnect Public Website
        ↓
Frontend Demo Login
        ↓
EXISTING CAConnect Dashboard

Use:

React + Vite + Tailwind CSS + React State + localStorage ONLY.

No database.
No backend.
No external authentication.
No external API.
No unnecessary libraries.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c287f130-b9d4-455e-9e1c-a41f894e022d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
