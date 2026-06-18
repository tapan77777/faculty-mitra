"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, Zap, MessageSquare, Users } from "lucide-react";

const pillars = [
  {
    icon: <TrendingUp className="w-6 h-6 text-[#635BFF]" strokeWidth={1.5} />,
    title: "Industry Signals",
    desc: "Live trending and declining skills per subject — with growth percentages, hiring companies, and source citations. Updated quarterly from NASSCOM and India Skills Report data.",
    badge: null,
  },
  {
    icon: <Zap className="w-6 h-6 text-[#635BFF]" strokeWidth={1.5} />,
    title: "Specific Actions",
    desc: "AI generates assignments, audits syllabuses, and recommends what to teach — with Indian industry context, Indian company examples, and Indian salary data.",
    badge: null,
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-[#635BFF]" strokeWidth={1.5} />,
    title: "Student Feedback Loops",
    desc: "Anonymous student polls on syllabus relevance. Faculty see what students think — without awkward face-to-face conversations.",
    badge: "Coming Phase 3",
  },
  {
    icon: <Users className="w-6 h-6 text-[#635BFF]" strokeWidth={1.5} />,
    title: "Peer Faculty Network",
    desc: "Connect with other faculty teaching the same subject across India. Share what's working. Stay updated together.",
    badge: "Coming Phase 3",
  },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="features" ref={ref} className="py-20 md:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A2540] mb-3">
            Four Pillars. One Workflow.
          </h2>
          <p className="text-[#425466] text-lg max-w-2xl mx-auto">
            FacultyMitra is not just AI chat. It&apos;s a complete teaching support system.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-[#E3E8EE] rounded-2xl p-8 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 relative"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F0F0FF] flex items-center justify-center mb-5">
                {p.icon}
              </div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-base font-semibold text-[#0A2540]">{p.title}</h3>
                {p.badge && (
                  <span className="flex-shrink-0 text-xs font-medium text-[#8898AA] bg-[#F6F9FC] border border-[#E3E8EE] px-2 py-0.5 rounded-md">
                    {p.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#425466] leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
