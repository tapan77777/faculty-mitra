import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const QUARTER = 'Q2 2026';

const seeds = [
  {
    subject: 'Computer Science',
    quarter: QUARTER,
    trending_skills: [
      { name: 'Cloud Computing (AWS/Azure)', growth: '+34%', context: 'AWS Mumbai region expanding — 12,000+ cloud roles open in India' },
      { name: 'Python for AI/ML', growth: '+42%', context: 'Most demanded skill in India — NASSCOM 2024, 1M+ AI roles by 2026' },
      { name: 'Cybersecurity Fundamentals', growth: '+28%', context: 'Critical skill gap: India faces 50% shortage in certified professionals' },
      { name: 'React / Next.js', growth: '+24%', context: 'Standard frontend stack at Flipkart, Razorpay, Zomato, and 80% of startups' },
      { name: 'DevOps & CI/CD', growth: '+31%', context: 'Required in 70% of IT job descriptions — Kubernetes + GitHub Actions dominant' },
    ],
    declining_skills: [
      { name: 'MS Office Suite (basic)', decline: '-45%', context: 'Replaced by Google Workspace & collaborative tools in all modern workplaces' },
      { name: 'Pascal / COBOL', decline: '-89%', context: 'Zero fresher roles. Legacy banking code migration happening — not taught fresh' },
      { name: 'Flash / ActionScript', decline: '-100%', context: 'Discontinued by Adobe in 2020. Completely irrelevant — remove from syllabus' },
    ],
    hiring_companies: ['TCS', 'Infosys', 'Wipro', 'Flipkart', 'Razorpay', 'Zomato', 'Swiggy', 'Paytm', 'Google India', 'Microsoft India'],
    source_citation: 'NASSCOM Talent Report 2024 + India Skills Report 2024 (Wheebox)',
  },
  {
    subject: 'Electronics and Communication',
    quarter: QUARTER,
    trending_skills: [
      { name: 'IoT & Embedded Systems', growth: '+38%', context: 'India IoT market projected ₹94,000 Cr by 2025 — smart cities & Industry 4.0 push' },
      { name: 'Embedded Systems with Python/MicroPython', growth: '+29%', context: 'Raspberry Pi + ESP32 ecosystem now industry-standard for rapid prototyping' },
      { name: '5G Network Fundamentals', growth: '+41%', context: 'Jio & Airtel 5G rollout — BSNL 5G contracts creating 40,000+ radio/core network jobs' },
      { name: 'VLSI Design (Cadence/Synopsys)', growth: '+33%', context: 'India Semiconductor Mission: ₹76,000 Cr investment — Micron & Applied Materials hiring' },
      { name: 'Robotics & ROS', growth: '+26%', context: 'DRDO, ISRO, and defense PSUs scaling autonomous systems programmes aggressively' },
    ],
    declining_skills: [
      { name: 'Analog-only circuit design (no simulation)', decline: '-52%', context: 'All industry design now uses SPICE simulation — pure analog breadboard skills insufficient' },
      { name: 'Discrete component assembly without CAD', decline: '-61%', context: 'PCB design tools (KiCad, Altium) mandatory. Hand-assembly skills not valued for freshers' },
      { name: 'AutoCAD-only 2D drafting', decline: '-47%', context: 'Replaced by SolidWorks + CATIA 3D + simulation. 2D-only drawing not accepted in ECE roles' },
    ],
    hiring_companies: ['Qualcomm India', 'Intel India', 'Samsung R&D', 'ISRO', 'DRDO', 'Broadcom', 'MediaTek', 'Tata Elxsi', 'L&T Technology'],
    source_citation: 'NASSCOM Engineering Report 2024 + India Semiconductor Mission 2024',
  },
  {
    subject: 'Mechanical Engineering',
    quarter: QUARTER,
    trending_skills: [
      { name: 'CAD/CAM with FEA Simulation (ANSYS/SolidWorks)', growth: '+35%', context: 'L&T, Tata, Mahindra require simulation-validated designs — 3D + FEA is the minimum bar' },
      { name: 'Industry 4.0 & Smart Manufacturing', growth: '+29%', context: 'Automotive + heavy engineering factories automating — PLC, SCADA, digital twin knowledge valued' },
      { name: 'EV Powertrain & Battery Technology', growth: '+47%', context: 'Tata EV, Ola Electric, Bajaj EV hiring aggressively — ICE-only knowledge insufficient by 2026' },
      { name: '3D Printing & Additive Manufacturing', growth: '+22%', context: 'ISRO, HAL, aerospace supply chain using metal AM — GE Aerospace India expanding rapidly' },
      { name: 'Robotics & Automation (ROS, PLCs)', growth: '+31%', context: 'Automobile assembly lines replacing manual tasks — Bosch, Maruti, Hyundai retooling plants' },
    ],
    declining_skills: [
      { name: 'Manual drafting (drawing board only)', decline: '-78%', context: 'No company accepts hand-drawn engineering drawings. CAD proficiency is gate-level requirement' },
      { name: 'IC Engine focus without EV context', decline: '-39%', context: 'Government mandated 30% EV sales by 2030 — ICE-only mechanical engineers face shrinking market' },
      { name: 'Hand calculations without software validation', decline: '-44%', context: 'MATLAB, Python, ANSYS expected for all stress/thermal analysis. Manual calculations seen as incomplete' },
    ],
    hiring_companies: ['Tata Motors', 'Mahindra & Mahindra', 'L&T', 'Bosch India', 'Bajaj Auto', 'Tata Steel', 'ISRO', 'HAL', 'Ola Electric'],
    source_citation: 'CII Manufacturing HR Report 2024 + India Skills Report 2024 (Wheebox)',
  },
  {
    subject: 'MBA',
    quarter: QUARTER,
    trending_skills: [
      { name: 'Data Analytics for Managers (Power BI / Tableau)', growth: '+39%', context: 'Consulting & FMCG firms now require data literacy as baseline — not just for analysts' },
      { name: 'Digital Marketing & Performance Analytics', growth: '+33%', context: 'D2C brand explosion (Mamaearth, boAt, Sugar) creating 35,000+ digital marketing manager roles' },
      { name: 'AI Literacy & Prompt Engineering for Business', growth: '+51%', context: 'McKinsey, BCG, Deloitte India teams using ChatGPT/Claude in client deliverables — gap is large' },
      { name: 'ESG Strategy & Sustainable Finance', growth: '+28%', context: 'SEBI BRSR mandate for top 1000 companies creating surge in ESG roles at banks & consultancies' },
      { name: 'FinTech & Digital Payments (UPI ecosystem)', growth: '+35%', context: 'Razorpay, Paytm, PhonePe, NPCI expanding — FinTech PM and strategy roles growing 40% YoY' },
    ],
    declining_skills: [
      { name: 'Traditional case study methods (no live data)', decline: '-38%', context: 'Recruiters say MBA grads lack real-world data skills — Harvard cases without analytics insufficient' },
      { name: 'Print & outdoor marketing focus', decline: '-55%', context: 'Print ad spend down 18% in 2023. Digital now 67% of all ad spend in India — FICCI report 2024' },
      { name: 'Manual financial modeling (Excel-only, no automation)', decline: '-41%', context: 'IB and consulting firms expect Python, VBA automation or Power Query — pure Excel modeling outdated' },
    ],
    hiring_companies: ['Deloitte India', 'McKinsey & Co.', 'Accenture Strategy', 'Flipkart', 'Razorpay', 'ICICI Bank', 'Hindustan Unilever', 'Asian Paints', 'BCG'],
    source_citation: 'NASSCOM Leadership Summit 2024 + FICCI Digital Economy Report 2024',
  },
  {
    subject: 'Commerce',
    quarter: QUARTER,
    trending_skills: [
      { name: 'GST Filing & Digital Taxation (ITR, TDS)', growth: '+44%', context: 'Every CA firm, SME, and corporate now requires GST literacy — India has 14M+ GST-registered firms' },
      { name: 'FinTech & UPI Ecosystem Understanding', growth: '+36%', context: 'NPCI processed ₹200 Lakh Cr via UPI in FY24 — banks & fintech hiring commerce grads with digital knowledge' },
      { name: 'Advanced Excel + Power BI / Tableau', growth: '+31%', context: 'All banking, insurance, and audit roles now require data visualization beyond basic Excel' },
      { name: 'Stock Market Analytics & Derivatives Basics', growth: '+29%', context: 'Zerodha, Groww, Angel One expanding — India added 40M new demat accounts in 2023 alone' },
      { name: 'Cryptocurrency & Blockchain Accounting', growth: '+24%', context: 'India VDA tax regime (30% + TDS) created demand for crypto-literate accountants and auditors' },
    ],
    declining_skills: [
      { name: 'Manual bookkeeping without software', decline: '-67%', context: 'Zero audit firms accept manual ledgers — Tally, QuickBooks, Zoho Books are baseline minimums' },
      { name: 'Pre-GST indirect tax systems (VAT/CST/Octroi)', decline: '-91%', context: 'GST replaced all in 2017. Teaching VAT structures is actively misleading for students entering practice' },
      { name: 'Tally-only without cloud accounting tools', decline: '-43%', context: 'Zoho Books, QuickBooks Online, SAP FICO now expected alongside Tally at mid-size firms and above' },
    ],
    hiring_companies: ['ICICI Bank', 'HDFC Bank', 'Razorpay', 'Zerodha', 'Groww', 'PhonePe', 'Deloitte India', 'KPMG India', 'PwC India', 'CA firms'],
    source_citation: 'ICAI Skill Development Report 2024 + India Skills Report 2024 (Wheebox)',
  },
];

async function main() {
  console.log('Seeding industry_pulse table...\n');

  for (const seed of seeds) {
    const { error: delError } = await supabase
      .from('industry_pulse')
      .delete()
      .eq('subject', seed.subject);

    if (delError) {
      console.error(`❌ Failed to delete "${seed.subject}":`, delError.message);
      continue;
    }

    const { error: insError } = await supabase
      .from('industry_pulse')
      .insert(seed);

    if (insError) {
      console.error(`❌ Failed to insert "${seed.subject}":`, insError.message);
    } else {
      console.log(`✅ Seeded: ${seed.subject}`);
    }
  }

  console.log('\nDone.');
}

main();
