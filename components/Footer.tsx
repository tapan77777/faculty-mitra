"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-[#051F1C] border-t border-white/5 py-10 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
      >
        <span className="text-xl font-bold text-[#0D9488]">FacultyMitra</span>

        <span className="text-gray-500 text-center">
          Team BharatMinds · Wadhwani AI Hackathon 2026 · Track 3.4
        </span>

        <a
          href="https://x.com/tapan_ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#5EEAD4] hover:text-[#0D9488] transition-colors font-medium"
        >
          @tapan_ai
        </a>
      </motion.div>
    </footer>
  );
}
