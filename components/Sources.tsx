"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";

const sources = [
  {
    name: "NASSCOM Talent Report 2024",
    desc: "India's IT industry body. Primary source for the 55% skill gap finding and trending technology skills.",
    href: "https://nasscom.in",
  },
  {
    name: "India Skills Report 2024",
    desc: "Wheebox + CII annual employability study. Source for the 51% unemployability finding.",
    href: "https://www.indiaskillsreport.in",
  },
  {
    name: "AICTE Annual Report 2024",
    desc: "Government body for technical education in India. Source for 45,000+ college count and curriculum data.",
    href: "https://www.aicte-india.org",
  },
  {
    name: "UGC Curriculum Review 2023",
    desc: "Higher education regulator. Source for the 5–8 year curriculum update gap finding.",
    href: "https://www.ugc.gov.in",
  },
];

export default function Sources() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A2540] mb-3">
            Built on Real Data.
          </h2>
          <p className="text-[#425466] text-lg max-w-2xl mx-auto">
            Every claim we make is backed by a credible source. No vibes-based AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sources.map((s, i) => (
            <motion.a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group bg-white border border-[#E3E8EE] rounded-xl p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-[#0A2540] leading-snug">{s.name}</p>
                <ExternalLink className="w-3.5 h-3.5 text-[#8898AA] group-hover:text-[#635BFF] flex-shrink-0 mt-0.5 transition-colors" strokeWidth={1.5} />
              </div>
              <p className="text-xs text-[#425466] leading-relaxed">{s.desc}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
