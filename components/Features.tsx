"use client";

import { motion } from "framer-motion";

const features = [
  {
    number: "01",
    title: "Syllabus Relevance Audit",
    description:
      "Upload or paste your syllabus. Get an instant relevance score, unit-by-unit analysis, and specific replacement suggestions.",
    accent: "#0D9488",
    bg: "bg-[#0D9488]/5",
    border: "border-[#0D9488]/20",
    bullets: [
      "Unit-wise relevance score (0–100)",
      "Flags obsolete topics with emoji markers",
      "Industry-aligned replacement suggestions",
      "Language: English, Hindi, or regional",
    ],
  },
  {
    number: "02",
    title: "Practical Assignment Generator",
    description:
      "Get real-world, project-based assignments tailored to the subject, semester, and skill level of your students.",
    accent: "#7C3AED",
    bg: "bg-purple-50",
    border: "border-purple-200",
    bullets: [
      "Subject + semester aware generation",
      "Connects theory to industry scenarios",
      "Difficulty levels: beginner to advanced",
      "Includes evaluation rubric & hints",
    ],
  },
  {
    number: "03",
    title: "Topic Explainer & Upskill",
    description:
      "Ask whether a topic is worth teaching. Get a verdict, real-world use cases, and a compact teach-it-in-1-class guide.",
    accent: "#F59E0B",
    bg: "bg-amber-50",
    border: "border-amber-200",
    bullets: [
      "Relevance verdict: teach / skip / partial",
      "Real Indian industry use cases",
      "1-class structured teach guide",
      "What to skip for non-specialised courses",
    ],
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-[#F0FDFB] py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="text-xs font-bold tracking-[0.2em] text-[#0D9488] uppercase">
            3 Core Features
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl font-extrabold text-[#0A2E2A] mb-14 max-w-xl"
        >
          Everything a faculty needs.{" "}
          <span className="text-[#0D9488]">Nothing they don&apos;t.</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}
              className={`rounded-2xl p-8 border-2 ${f.bg} ${f.border} transition-shadow duration-300`}
            >
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-white font-extrabold text-lg mb-5"
                style={{ backgroundColor: f.accent }}
              >
                {f.number}
              </div>

              <h3 className="font-extrabold text-[#0A2E2A] text-xl mb-3 leading-tight">
                {f.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                {f.description}
              </p>

              <ul className="space-y-2.5">
                {f.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: f.accent }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
