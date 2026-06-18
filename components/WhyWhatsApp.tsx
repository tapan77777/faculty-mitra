"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, X } from "lucide-react";

const rows = [
  { feature: "General AI capability",          chatgpt: true,   us: true,    usNote: null },
  { feature: "Indian industry context",         chatgpt: "Generic", us: true, usNote: "TCS, Flipkart, Razorpay, Swiggy" },
  { feature: "Curated, cited industry data",    chatgpt: false,  us: true,   usNote: "NASSCOM 2024 + India Skills Report" },
  { feature: "Hindi + code-mixed input",        chatgpt: "Basic", us: true,  usNote: "Optimized for Indian faculty" },
  { feature: "Save & search audit history",     chatgpt: false,  us: true,   usNote: null },
  { feature: "Faculty verification system",     chatgpt: false,  us: true,   usNote: null },
  { feature: "PDF reports for HoD/Admin",       chatgpt: false,  us: true,   usNote: null },
  { feature: "WhatsApp access (low-bandwidth)", chatgpt: false,  us: true,   usNote: null },
  { feature: "Free for AICTE colleges",         chatgpt: false,  us: true,   usNote: "Forever free tier" },
];

function Cell({ value, note }: { value: boolean | string; note: string | null }) {
  if (value === true) {
    return (
      <span className="flex items-center gap-1.5 text-[#0E9F6E]">
        <Check className="w-4 h-4" strokeWidth={2.5} />
        {note && <span className="text-xs text-[#425466]">{note}</span>}
      </span>
    );
  }
  if (value === false) {
    return <X className="w-4 h-4 text-[#8898AA]" strokeWidth={2} />;
  }
  return <span className="text-xs text-[#8898AA]">{value}</span>;
}

export default function WhyWhatsApp() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A2540] mb-3">
            Why not just use ChatGPT?
          </h2>
          <p className="text-[#425466] text-lg max-w-2xl mx-auto">
            Honest comparison — because faculty need a tool, not just an answer.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="bg-white border border-[#E3E8EE] rounded-2xl overflow-hidden shadow-sm"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F6F9FC] border-b border-[#E3E8EE]">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider w-1/2">Feature</th>
                <th className="text-center px-5 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider w-1/4">ChatGPT / MetaAI</th>
                <th className="text-center px-5 py-3.5 text-xs font-semibold text-[#635BFF] uppercase tracking-wider w-1/4 bg-[#F0F0FF]">FacultyMitra</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-[#E3E8EE] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#F6F9FC]/50"}`}
                >
                  <td className="px-5 py-3.5 text-[#0A2540] font-medium">{row.feature}</td>
                  <td className="px-5 py-3.5 text-center">
                    <Cell value={row.chatgpt} note={null} />
                  </td>
                  <td className="px-5 py-3.5 text-center bg-[#F0F0FF]/30">
                    <Cell value={row.us} note={row.usNote} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
