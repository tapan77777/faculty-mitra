"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Play } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-[#E3E8EE]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <span className="text-base font-bold text-[#0A2540] tracking-tight">FacultyMitra</span>
        </Link>

        {/* Nav links — desktop */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-[#425466] hover:text-[#0A2540] transition-colors">Features</a>
          <a href="#product" className="text-sm text-[#425466] hover:text-[#0A2540] transition-colors">Product</a>
          <a href="#team" className="text-sm text-[#425466] hover:text-[#0A2540] transition-colors">Team</a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#425466] hover:text-[#0A2540] transition-colors"
          >
            GitHub
          </a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/faculty/login"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-white bg-[#635BFF] hover:bg-[#5851DB] px-4 py-2 rounded-lg transition-colors"
          >
            Try Live Demo
          </Link>
          <Link
            href="/faculty/login"
            className="sm:hidden inline-flex items-center gap-1.5 text-xs font-medium text-white bg-[#635BFF] hover:bg-[#5851DB] px-3 py-1.5 rounded-lg transition-colors"
          >
            <Play className="w-3 h-3" strokeWidth={2} />
            Demo
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
