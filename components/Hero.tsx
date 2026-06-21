"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Play, ArrowRight, X } from "lucide-react";

const VIDEO_URL = "https://drive.google.com/file/d/1WFa069aEyNJsjiX0Hts36eO0Rd1trHUY/preview";

export default function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setVideoOpen(false); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [videoOpen]);

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
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <Link
            href="/faculty/login"
            className="inline-flex items-center gap-2 bg-[#635BFF] hover:bg-[#5851DB] text-white font-semibold text-base px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-[#635BFF]/20 hover:shadow-xl hover:shadow-[#635BFF]/30 hover:-translate-y-0.5"
          >
            Try Live Demo
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
          <button
            onClick={() => setVideoOpen(true)}
            className="inline-flex items-center gap-2 bg-white border border-[#E3E8EE] hover:border-[#635BFF]/40 hover:bg-[#F5F7FF] text-[#425466] hover:text-[#0A2540] font-medium text-base px-8 py-4 rounded-xl transition-all duration-200"
          >
            <Play className="w-4 h-4 text-[#635BFF]" strokeWidth={2} />
            Watch 2-min Video
          </button>
        </motion.div>

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

      {/* Video modal */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4"
            onClick={(e) => { if (e.target === overlayRef.current) setVideoOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setVideoOpen(false)}
                className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
                aria-label="Close video"
              >
                <X className="w-6 h-6" strokeWidth={2} />
              </button>

              {/* 16:9 iframe container */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={VIDEO_URL}
                  className="absolute inset-0 w-full h-full rounded-2xl"
                  allow="autoplay"
                  allowFullScreen
                  title="FacultyMitra Demo"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
