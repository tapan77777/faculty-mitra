"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E3E8EE] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0A2540]">FacultyMitra</p>
              <p className="text-xs text-[#8898AA]">AI Co-Pilot for Indian Faculty</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#425466]">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0A2540] transition-colors"
            >
              GitHub
            </a>
            <Link href="#" className="hover:text-[#0A2540] transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-[#0A2540] transition-colors">Terms</Link>
            <a href="mailto:hello@facultymitra.com" className="hover:text-[#0A2540] transition-colors">
              Contact
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#E3E8EE] space-y-1">
          <p className="text-xs text-[#8898AA]">
            © 2026 BharatMinds. Built for Wadhwani AI&apos;s SahAI for Shiksha Hackathon 2026.
          </p>
          <p className="text-xs text-[#8898AA]">
            FacultyMitra is a Phase 2 MVP. Production features marked &apos;Coming Phase 3&apos; are not yet built.
          </p>
        </div>
      </div>
    </footer>
  );
}
