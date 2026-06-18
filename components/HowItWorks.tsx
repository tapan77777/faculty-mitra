"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const screenshots = [
  {
    image: "/screenshots/audit-result.png",
    title: "Audit Your Syllabus in 30 Seconds",
    desc: "Paste your syllabus. AI analyzes against current industry needs. Returns a relevance score, unit-by-unit verdict (KEEP / UPDATE / REMOVE), and specific suggestions with Indian industry context.",
    link: "/faculty/audit",
    linkText: "Try Syllabus Audit",
    imageLeft: true,
  },
  {
    image: "/screenshots/industry-pulse.png",
    title: "Stay Ahead of Industry Trends",
    desc: "Live curated data on what skills are growing (Cloud +34%, Python +42%) and declining (MS Office -45%, Pascal -89%). Sourced from NASSCOM 2024 and India Skills Report. Updated quarterly.",
    link: null,
    linkText: null,
    imageLeft: false,
  },
  {
    image: "/screenshots/topic-analyzer.png",
    title: "Decide What to Teach",
    desc: "Faculty often wonder — \"Should I teach Blockchain? Is Web3 worth it?\" FacultyMitra gives a TEACH / SKIP / PARTIAL verdict with Indian use cases, a 1-class teaching guide, and real career data.",
    link: "/faculty/topic",
    linkText: "Try Topic Analyzer",
    imageLeft: true,
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="product" ref={ref} className="py-20 md:py-28 bg-[#F6F9FC]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A2540] mb-3">
            See It Working.
          </h2>
          <p className="text-[#425466] text-lg max-w-2xl mx-auto">
            Real screenshots from the live product. Try it yourself in 30 seconds.
          </p>
        </motion.div>

        <div className="space-y-8">
          {screenshots.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className={`bg-white border border-[#E3E8EE] rounded-2xl overflow-hidden shadow-sm flex flex-col ${
                s.imageLeft ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Screenshot */}
              <div className="md:w-3/5 relative bg-[#F6F9FC] border-b md:border-b-0 md:border-r border-[#E3E8EE] overflow-hidden min-h-[220px]">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 60vw"
                  priority={i === 0}
                />
              </div>

              {/* Text */}
              <div className="md:w-2/5 p-8 flex flex-col justify-center">
                <h3 className="text-xl font-bold tracking-tight text-[#0A2540] mb-3">
                  {s.title}
                </h3>
                <p className="text-sm text-[#425466] leading-relaxed mb-5">{s.desc}</p>
                {s.link && (
                  <Link
                    href={s.link}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#635BFF] hover:text-[#5851DB] transition-colors"
                  >
                    {s.linkText}
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
