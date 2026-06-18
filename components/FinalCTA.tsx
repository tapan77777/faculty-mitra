"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-gradient-to-br from-[#635BFF] to-[#5851DB]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-5">
            Ready to see it in action?
          </h2>
          <p className="text-white/70 text-lg mb-10">
            30 seconds to test. No signup required for evaluation.
          </p>
          <Link
            href="/faculty/login"
            className="inline-flex items-center gap-2 bg-white text-[#635BFF] font-bold text-base px-10 py-4 rounded-xl hover:bg-[#F0F0FF] transition-all duration-200 shadow-xl hover:-translate-y-0.5"
          >
            Try Live Demo
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
          <p className="text-white/50 text-sm mt-5">
            Or watch the 2-min walkthrough (coming soon)
          </p>
        </motion.div>
      </div>
    </section>
  );
}
