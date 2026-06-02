"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center bg-[#0A2E2A] overflow-hidden px-4 pt-16"
    >
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(13,148,136,0.15)_0%,_transparent_70%)] pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#5EEAD4 1px, transparent 1px), linear-gradient(90deg, #5EEAD4 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full bg-[#0D9488]/20 text-[#5EEAD4] border border-[#0D9488]/30 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#5EEAD4] animate-pulse" />
          AI-Powered · WhatsApp-Native · For Bharat
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6"
        >
          Your AI Teaching{" "}
          <span className="text-[#5EEAD4]">Assistant</span>
          <br />
          on WhatsApp
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-lg sm:text-xl text-[#CCFBF1]/70 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Paste your syllabus. Get what&apos;s outdated, what industry wants,
          and ready-to-use assignments — instantly.{" "}
          <span className="text-[#5EEAD4]">In any language.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0D9488]/20 border border-[#0D9488]/40 text-[#CCFBF1] text-sm font-medium backdrop-blur-sm">
            🏆 Track 3.4 — Faculty &amp; Trainer Capacity
          </span>
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[#CCFBF1]/80 text-sm font-medium backdrop-blur-sm">
            👥 Team BharatMinds
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[#5EEAD4]/50 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-[#5EEAD4]/30 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-[#5EEAD4]/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
