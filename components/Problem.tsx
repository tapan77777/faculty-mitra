"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const start = Date.now();
    const duration = 1200;
    const raf = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [isInView, target]);

  return <span ref={ref}>{display}{suffix}</span>;
}

const stats = [
  {
    value: 55,
    suffix: "%",
    label: "of skills in campus placement tests are NOT in current curriculum",
    source: "NASSCOM Talent Report 2024",
  },
  {
    value: 51,
    suffix: "%",
    label: "of Indian graduates are unemployable in IT roles",
    source: "India Skills Report 2024 (Wheebox)",
  },
  {
    value: 45000,
    suffix: "+",
    label: "colleges in India with outdated or unreviewed curriculum",
    source: "AICTE Annual Report 2024",
  },
  {
    display: "5–8 yrs",
    label: "average gap between curriculum update and industry need",
    source: "UGC Curriculum Review 2023",
  },
];

export default function Problem() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-[#F6F9FC]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A2540] mb-3">
            The Curriculum Gap is Real.
          </h2>
          <p className="text-[#425466] text-lg">And it&apos;s getting wider every year.</p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white border border-[#E3E8EE] rounded-2xl p-6 text-center"
            >
              <div className="text-4xl sm:text-5xl font-bold text-[#0A2540] mb-3 leading-none">
                {"display" in stat ? (
                  <span>{stat.display}</span>
                ) : (
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                )}
              </div>
              <p className="text-sm text-[#425466] leading-snug mb-3">{stat.label}</p>
              <p className="text-xs text-[#8898AA]">{stat.source}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
