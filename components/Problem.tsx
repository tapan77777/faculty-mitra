"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";

const stats = [
  { value: "45,000+", label: "Colleges & ITIs in India" },
  { value: "54%", label: "Graduates not employable" },
  { value: "5–7 yrs", label: "Average syllabus behind industry" },
  { value: "0", label: "AI tools built for faculty" },
];

const chain = [
  "Outdated syllabus",
  "Theory-heavy classes",
  "No practical skills",
  "Students can't get jobs",
  "Poverty cycle continues",
];

const inView = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" as const },
};

export default function Problem() {
  return (
    <section id="problem" className="bg-white py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div {...inView} transition={{ duration: 0.6 }} className="mb-4">
          <span className="text-xs font-bold tracking-[0.2em] text-[#0D9488] uppercase">
            The Problem
          </span>
        </motion.div>

        <motion.h2
          {...inView}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl font-extrabold text-[#0A2E2A] mb-12 max-w-2xl"
        >
          Millions of teachers are left behind.{" "}
          <span className="text-[#0D9488]">Their students pay the price.</span>
        </motion.h2>

        {/* Story quote */}
        <motion.div
          {...inView}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="border-l-4 border-amber-400 bg-amber-50 rounded-r-2xl p-6 mb-14 max-w-3xl"
        >
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            <span className="font-bold text-[#0A2E2A]">Ramesh Sir, 52,</span> has been
            teaching the same Networking syllabus at a Govt ITI since 2014. He is not
            lazy. He just has{" "}
            <span className="font-semibold text-amber-700">
              no system to know what changed.
            </span>{" "}
            His students graduate, apply for jobs, and get rejected.
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(13,148,136,0.12)" }}
              className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0D9488] mb-2">
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="text-sm text-gray-500 font-medium leading-snug">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Root cause chain */}
        <motion.div
          {...inView}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-xs font-bold tracking-[0.15em] text-gray-400 uppercase mb-4">
            Root Cause Chain
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {chain.map((item, i) => (
              <div key={item} className="flex items-center gap-2">
                <div
                  className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                    i === chain.length - 1
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  {item}
                </div>
                {i < chain.length - 1 && (
                  <span className="text-gray-300 font-bold text-lg">→</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
