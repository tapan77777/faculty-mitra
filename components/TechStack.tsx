"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stack = [
  "Anthropic Claude 3.5",
  "Next.js 14",
  "Supabase",
  "Vercel",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
];

export default function TechStack() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-16 bg-[#F6F9FC] border-t border-[#E3E8EE]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold text-[#8898AA] uppercase tracking-widest mb-6">Built with</p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {stack.map((tech) => (
              <span
                key={tech}
                className="text-sm font-medium text-[#425466] bg-white border border-[#E3E8EE] px-4 py-2 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="text-sm text-[#8898AA]">
            Open source on GitHub —{" "}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#635BFF] hover:text-[#5851DB] transition-colors"
            >
              code review welcome
            </a>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}
