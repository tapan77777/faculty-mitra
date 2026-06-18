"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Award, Play, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-[#F0F0FF] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-[#F0F0FF] border border-[#635BFF]/20 text-[#635BFF] text-xs font-semibold px-4 py-2 rounded-full mb-8"
        >
          <Award className="w-3.5 h-3.5" strokeWidth={2} />
          Built for Wadhwani AI · SahAI for Shiksha Hackathon 2026
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] text-[#0A2540] mb-6"
        >
          AI Co-Pilot for
          <br />
          <span className="text-[#635BFF]">Indian College Faculty.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="text-lg sm:text-xl md:text-2xl text-[#425466] max-w-3xl mx-auto leading-relaxed mb-10"
        >
          Audit your syllabus against industry standards. Generate practical
          assignments. Stay ahead of changing skill demands — all in 30 seconds,
          in the language you teach in.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4"
        >
          <Link
            href="/faculty/login"
            className="inline-flex items-center gap-2 bg-[#635BFF] hover:bg-[#5851DB] text-white font-semibold text-base px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-[#635BFF]/20 hover:shadow-xl hover:shadow-[#635BFF]/30 hover:-translate-y-0.5"
          >
            Try Live Demo
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
          <button
            disabled
            className="inline-flex items-center gap-2 bg-white border border-[#E3E8EE] text-[#425466] font-medium text-base px-8 py-4 rounded-xl opacity-50 cursor-not-allowed"
          >
            <Play className="w-4 h-4 text-[#635BFF]" strokeWidth={2} />
            Watch 2-min Video
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-xs text-[#8898AA] mb-10"
        >
          Demo video coming soon
        </motion.p>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42 }}
          className="inline-flex flex-wrap justify-center items-center gap-3 text-xs text-[#8898AA] border border-[#E3E8EE] rounded-full px-5 py-2.5 bg-white"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0E9F6E] animate-pulse" />
            3 verified faculty
          </span>
          <span className="text-[#E3E8EE]">·</span>
          <span>3 colleges</span>
          <span className="text-[#E3E8EE]">·</span>
          <span>Built in 9 days</span>
        </motion.div>
      </div>
    </section>
  );
}
