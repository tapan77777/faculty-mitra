"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Poonam Dungdung",
    role: "Teacher",
    institution: "Udyabata H/S, Odisha",
    quote:
      "The audit feature showed me exactly what's outdated in my syllabus. Very useful for planning next term.",
  },
  {
    name: "Sudeep Soreng",
    role: "Faculty",
    institution: "ITI UKT, Odisha",
    quote:
      "Industry Pulse helped me understand what skills companies actually need today. This is what we were missing.",
  },
  {
    name: "Sudam Beshra",
    role: "Faculty",
    institution: "ITI, Odisha",
    quote:
      "Topic Analyzer is brilliant — it gave me clear reasoning on what to teach and what to skip. Saves real time.",
  },
  {
    name: "Nilu Ekka",
    role: "Faculty",
    institution: "ITI, Odisha",
    quote:
      "Score and gap-list told me what to add to my course. Direct and practical, not just theory.",
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-20 bg-[#F6F9FC]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A2540] mb-3">
            Educators are already using FacultyMitra
          </h2>
          <p className="text-[#425466] text-lg max-w-xl mx-auto">
            Early feedback from Phase 2 testers across schools and ITIs in Odisha.
          </p>
        </motion.div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <Quote className="w-6 h-6 text-[#635BFF]" strokeWidth={1.5} />

              <p className="mt-4 italic text-slate-700 leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="border-t border-slate-100 my-6" />

              <p className="font-semibold text-slate-900">{t.name}</p>
              <p className="text-sm text-slate-500 mt-0.5">
                {t.role} · {t.institution}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Honest note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-sm text-slate-500 italic text-center"
        >
          Phase 3: Structured outreach to 50+ engineering college faculty across India is underway.
        </motion.p>
      </div>
    </section>
  );
}
