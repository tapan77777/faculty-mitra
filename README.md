<div align="center">

# FacultyMitra

### AI Co-Pilot for Indian College Faculty

Audit your syllabus against industry standards. Generate practical assignments. Stay ahead of changing skill demands — in 30 seconds, in the language you teach in.

[**Try Live Demo →**](https://faculty-mitra.vercel.app) · [Watch Demo Video](#) · [Report Bug](https://github.com/tapan77777/faculty-mitra/issues)

🏆 Built for [Wadhwani AI's SahAI for Shiksha Hackathon 2026](https://wadhwaniai.reskilll.com) · Phase 2 Top 30

</div>

---

## The Problem

- **55%** of skills tested in campus placements are not in curriculum — *NASSCOM Talent Report 2024*
- **51%** of Indian graduates are unemployable in IT roles — *India Skills Report 2024 (Wheebox)*
- **5-8 years** average gap between curriculum revision and industry needs — *UGC 2023*
- **45,000+** colleges with outdated curriculum across India — *AICTE 2024*

Faculty aren't lazy — they lack a system to stay updated. Existing tools (ChatGPT, MetaAI) give answers but not workflows. Government tools (NPTEL, SWAYAM) are passive content libraries, not active assistants.

## The Solution

FacultyMitra is a four-pillar system, not a chatbot:

| Pillar | What it does |
|--------|--------------|
| **Industry Signals** | Curated trending/declining skills per subject, sourced from NASSCOM + India Skills Report, updated quarterly |
| **Specific Actions** | AI-generated syllabus audits, assignments, and topic analysis with Indian industry context |
| **Student Feedback** | Anonymous polls on syllabus impact (Phase 3) |
| **Peer Network** | Connect with faculty teaching the same subject across India (Phase 3) |

## Features (Phase 2 — Live Now)

- 🔍 **Audit My Syllabus** — Get a relevance score, unit-by-unit KEEP/UPDATE/REMOVE verdict, and specific suggestions
- ✍️ **Generate Assignment** — AI creates a complete assignment with grading rubric, tasks, and Indian industry context
- 📚 **Check a Topic** — Verdict (TEACH/SKIP/PARTIAL) + Indian use cases + 1-class teach guide + career data
- 📊 **Industry Pulse Dashboard** — Live data on what's hot and what's outdated in your subject
- 📥 **PDF Export** — Download any analysis for HoD review or documentation
- 🗂️ **History** — Full searchable history of all your audits, assignments, and topic checks
- ✅ **Verified Faculty Badge** — Trust signal for institutional users
- 👨‍💼 **Admin Dashboard** — Real-time usage analytics and faculty management
- 💬 **WhatsApp Bot** — Secondary channel for low-bandwidth field deployment (Twilio Sandbox)

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **AI:** Anthropic Claude Sonnet 4.5 (`claude-sonnet-4-5`)
- **Database:** Supabase (PostgreSQL + auth)
- **Styling:** Tailwind CSS with custom Stripe-inspired design system
- **PDF Generation:** @react-pdf/renderer
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **WhatsApp:** Twilio Programmable Messaging
- **Deployment:** Vercel
- **Form Validation:** Native + zod (planned)

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Supabase account (free tier)
- Anthropic API key
- Twilio account (optional, for WhatsApp bot)

### Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/tapan77777/faculty-mitra.git
cd faculty-mitra

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your keys (see below)

# 4. Initialize database
# Run the SQL files in /supabase/migrations in your Supabase project

# 5. Seed Industry Pulse data
npx tsx scripts/seed-industry-pulse.ts

# 6. Run dev server
npm run dev

# 7. Open in browser
# Visit http://localhost:3000
```

### Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=sk-ant-...

# Optional (for WhatsApp bot)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### Supabase Schema

The database has 6 tables: `faculty_profiles`, `pending_onboarding`, `message_logs`, `conversation_state`, `industry_pulse`. SQL DDL is in `/supabase/migrations/`.

## For Hackathon Evaluators

**Quick access without signup:**
1. Visit https://faculty-mitra.vercel.app
2. Click "Try Live Demo"
3. Click "Quick Judge Access" on the login page
4. Auto-logged in as "Wadhwani Evaluator" with verified status

**Admin panel:**
- URL: https://faculty-mitra.vercel.app/admin/login
- Email: `admin@facultymitra.com`
- Password: `wadhwani2026`

**Test the AI yourself:**
- Audit: paste any syllabus — try the sample button if you don't have one handy
- Assign: try topic "SQL Joins", subject "Computer Science", difficulty "Intermediate", 4 hours
- Topic: try "Blockchain" with subject "MCA" — note the PARTIAL verdict and Indian use cases

## Project Structure

```
faculty-mitra/
├── app/
│   ├── (root landing page sections)
│   ├── faculty/           # Faculty web portal
│   │   ├── login/
│   │   └── (dashboard)/
│   │       ├── dashboard/
│   │       ├── audit/
│   │       ├── assign/
│   │       ├── topic/
│   │       ├── history/
│   │       └── profile/
│   ├── admin/             # Admin panel
│   └── api/               # API routes
├── components/            # Landing page components
├── lib/                   # Shared utilities, Supabase client, Claude client
├── scripts/               # Seed scripts
├── public/                # Static assets including screenshots
└── docs/                  # Documentation including AI evaluation
```

## Architecture Decisions

**Why Next.js App Router?** Server components reduce client JS, faster page loads for low-bandwidth users in Tier-2/3 cities.

**Why Supabase over Firebase?** PostgreSQL flexibility, lower cost at scale, open source, Indian data residency available.

**Why Claude Sonnet 4.5 over GPT-4?** Better structured JSON output reliability (100% valid JSON across 30+ test runs), better instruction following for "no markdown, JSON only" prompts, strong reasoning on Indian context.

**Why dual-channel (web + WhatsApp)?** Web is the primary product for institutions. WhatsApp serves faculty in low-bandwidth areas as a field deployment channel. Both share the same backend.

**Why curated Industry Pulse instead of live scraping?** For Phase 2, manual quarterly curation from NASSCOM/India Skills Report gives 100% data quality. Phase 3 will add LinkedIn/Naukri API for live data.

## Team — BharatMinds

**Tapan Naik** — Engineering Lead  
B.Tech CSE, OUTR Rourkela. Solo founder at BuddyTech Labs. 3+ years shipping SaaS products.  
[GitHub](https://github.com/tapan77777) · [X](https://x.com/tapan_ai) · [LinkedIn](#)

**Angel Alka Sanga** — Design & Research  
Design lead and user research. Drives product strategy and faculty interviews.

## Roadmap

- **Phase 2 (Current — June 2026):** MVP with web + WhatsApp, 3 AI features, Industry Pulse for 5 subjects, verification system
- **Phase 3 (Jul-Sep 2026):** .ac.in email verification, Hindi depth, PWA conversion, basic LMS integration
- **Phase 4 (Oct-Dec 2026):** Paid tier launch, institute SSO, department analytics, bulk onboarding
- **Phase 5 (Jan-Mar 2027):** LinkedIn/Naukri API for live data, peer network feature, student feedback polls

## Contributing

This is a hackathon submission. Post-hackathon, contributions welcome. Open an issue first to discuss what you'd like to change.

## License

MIT License — see [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Wadhwani AI** for hosting the SahAI for Shiksha Hackathon 2026 and the mission to improve Indian education
- **Anthropic** for Claude API access
- **Vercel + Supabase** for free tiers that make solo founder MVPs possible
- **NASSCOM** and **Wheebox** for publishing industry data we cite throughout the product

---

<div align="center">

Built with intention in Rourkela, India 🇮🇳

[**faculty-mitra.vercel.app**](https://faculty-mitra.vercel.app)

</div>