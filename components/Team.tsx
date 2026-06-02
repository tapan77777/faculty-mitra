"use client";

import { motion } from "framer-motion";

const members = [
  {
    initials: "TN",
    name: "Tapan Naik",
    role: "Product & Engineering",
    avatarBg: "bg-[#0D9488]",
    skills: [
      "Solo founder, 3+ years building products",
      "MenuBuddy — live with paying clients",
      "Built RaveAI · InsightFlow · OdiaLipi",
      "Stack: Next.js · Supabase · Claude API · Vercel",
      "Google Gen AI Exchange Bootcamp alum",
      "Can build production product solo in 7 days",
    ],
  },
  {
    initials: "AA",
    name: "Angel Alka Sanga",
    role: "Design & Research",
    avatarBg: "bg-purple-600",
    skills: [
      "User research & problem validation",
      "UI/UX design & visual storytelling",
      "Owns the human side of FacultyMitra",
      "Research: NASSCOM · FICCI · AICTE data",
      "Bridges teacher pain and product design",
      "Ensures the product solves real problems",
    ],
  },
];

export default function Team() {
  return (
    <section id="team" className="bg-white py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="text-xs font-bold tracking-[0.2em] text-[#0D9488] uppercase">
            Team BharatMinds
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl font-extrabold text-[#0A2E2A] mb-14 max-w-lg"
        >
          Two people.{" "}
          <span className="text-[#0D9488]">One clear mission.</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {members.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              whileHover={{ y: -5, boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}
              className="rounded-2xl border border-gray-100 p-8 transition-shadow duration-300 bg-white"
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-14 h-14 rounded-full ${m.avatarBg} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white font-extrabold text-lg">{m.initials}</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-[#0A2E2A] text-xl">{m.name}</h3>
                  <p className="text-gray-500 text-sm">{m.role}</p>
                </div>
              </div>

              <ul className="space-y-2.5">
                {m.skills.map((skill) => (
                  <li key={skill} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] mt-1.5 flex-shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="rounded-2xl bg-[#0A2E2A] px-8 py-7 text-center"
        >
          <p className="text-[#CCFBF1] text-lg sm:text-xl font-semibold leading-relaxed">
            Tapan ships the product.{" "}
            <span className="text-[#5EEAD4]">Angel validates the problem.</span>{" "}
            <br className="hidden sm:block" />
            Together — build fast, think deep, win.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
