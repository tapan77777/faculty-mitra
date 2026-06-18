"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link2, ExternalLink } from "lucide-react";

const members = [
  {
    initials: "TN",
    name: "Tapan Naik",
    role: "Builder & Engineering",
    college: "B.Tech CSE, OUTR Rourkela",
    bio: "Solo founder, BuddyTech Labs. 3+ years shipping SaaS products. Built FacultyMitra end-to-end.",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
    color: "bg-[#F0F0FF] text-[#635BFF]",
  },
  {
    initials: "AA",
    name: "Angel Alka Sanga",
    role: "Design & Research",
    college: "Co-researcher",
    bio: "Design and user research lead. Conducted field interviews with faculty across 3 colleges.",
    linkedin: "https://linkedin.com",
    twitter: null,
    color: "bg-[#FFF0F9] text-[#C026D3]",
  },
];

export default function Team() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="team" ref={ref} className="py-20 md:py-28 bg-[#F6F9FC]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A2540] mb-3">
            Meet BharatMinds.
          </h2>
          <p className="text-[#425466] text-lg">The team behind FacultyMitra.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {members.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-[#E3E8EE] rounded-2xl p-6 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
            >
              {/* Avatar */}
              <div className={`w-14 h-14 rounded-2xl ${m.color} flex items-center justify-center text-xl font-bold mb-4`}>
                {m.initials}
              </div>

              <h3 className="text-base font-bold text-[#0A2540]">{m.name}</h3>
              <p className="text-sm font-medium text-[#635BFF] mt-0.5">{m.role}</p>
              <p className="text-xs text-[#8898AA] mt-0.5 mb-3">{m.college}</p>
              <p className="text-sm text-[#425466] leading-relaxed mb-4">{m.bio}</p>

              {/* Social links */}
              <div className="flex items-center gap-3">
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#8898AA] hover:text-[#0A2540] transition-colors"
                >
                  <span className="text-xs">LinkedIn</span>
                  <Link2 className="w-3 h-3" strokeWidth={1.5} />
                </a>
                {m.twitter && (
                  <a
                    href={m.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#8898AA] hover:text-[#0A2540] transition-colors"
                  >
                    <span className="text-xs">X / Twitter</span>
                    <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
