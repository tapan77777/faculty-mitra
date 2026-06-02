"use client";

import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <span className="text-xl font-bold text-[#0D9488] tracking-tight">
          FacultyMitra
        </span>

        <span className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse" />
          Track 3.4 — Wadhwani AI Hackathon 2026
        </span>

        <span className="sm:hidden inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20">
          Track 3.4
        </span>
      </div>
    </motion.nav>
  );
}
