"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: "💬",
    title: "Teacher texts on WhatsApp",
    description: "Any phone. Any network. Even 2G.",
  },
  {
    number: "02",
    icon: "🧠",
    title: "AI detects intent",
    description: "Syllabus audit · Topic check · Assignment request",
  },
  {
    number: "03",
    icon: "🔍",
    title: "Builds context",
    description: "Subject · Level · Preferred language",
  },
  {
    number: "04",
    icon: "⚡",
    title: "AI generates response",
    description: "Relevance score · Red flags · Ready assignments",
  },
  {
    number: "05",
    icon: "📱",
    title: "Reply sent to WhatsApp",
    description: "Clean, readable on any screen",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#0A2E2A] py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="text-xs font-bold tracking-[0.2em] text-[#5EEAD4] uppercase">
            How It Works
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl font-extrabold text-white mb-16 max-w-xl"
        >
          Five steps. Zero friction.{" "}
          <span className="text-[#5EEAD4]">Works on any phone.</span>
        </motion.h2>

        <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-0">
          {steps.map((step, i) => (
            <div key={step.number} className="flex lg:flex-col items-center lg:items-stretch flex-1">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className={`flex-1 rounded-2xl p-6 border transition-all ${
                  i % 2 === 0
                    ? "bg-[#0D9488] border-[#0D9488] text-white"
                    : "bg-[#0A2E2A] border-[#0D9488]/30 text-[#CCFBF1]"
                }`}
              >
                <div className="text-3xl mb-3">{step.icon}</div>
                <div className="text-xs font-bold tracking-[0.15em] opacity-60 mb-2">
                  STEP {step.number}
                </div>
                <div className="font-bold text-base mb-1 leading-snug">{step.title}</div>
                <div className="text-sm opacity-70 leading-relaxed">{step.description}</div>
              </motion.div>

              {i < steps.length - 1 && (
                <>
                  <div className="hidden lg:flex items-center justify-center w-8 flex-shrink-0 mt-16">
                    <span className="text-[#5EEAD4]/40 text-xl font-bold">→</span>
                  </div>
                  <div className="lg:hidden flex items-center justify-center h-8 w-full">
                    <span className="text-[#5EEAD4]/40 text-xl font-bold">↓</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
