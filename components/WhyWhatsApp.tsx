"use client";

import { motion } from "framer-motion";

const cards = [
  {
    icon: "🧠",
    title: "Zero learning curve",
    description: "Faculty already use WhatsApp daily. No app download. No login. No tutorial.",
  },
  {
    icon: "📶",
    title: "Works anywhere",
    description: "2G network. ₹5,000 Android phone. Works in rural ITIs, not just metro colleges.",
  },
  {
    icon: "🌐",
    title: "Regional languages built-in",
    description: "Type in Hindi, Odia, Tamil, or English. Get responses in the same language.",
  },
  {
    icon: "📊",
    title: "Massive scale instantly",
    description: "WhatsApp's infrastructure reaches 500M+ Indians. No new infra needed.",
  },
  {
    icon: "🚀",
    title: "Wadhwani can deploy today",
    description: "Plug into existing WhatsApp Business API. Deploy to 45,000+ colleges without distribution costs.",
  },
  {
    icon: "📴",
    title: "Offline friendly",
    description: "Messages queue and deliver when connectivity returns. No lost context.",
  },
];

export default function WhyWhatsApp() {
  return (
    <section id="why-whatsapp" className="bg-[#0A2E2A] py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="text-xs font-bold tracking-[0.2em] text-[#5EEAD4] uppercase">
            Why WhatsApp — Not an App or Website
          </span>
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#5EEAD4] mb-16 max-w-3xl leading-tight"
        >
          &ldquo;It&apos;s not a tool they have to learn.
          <br />
          <span className="text-white">It&apos;s a colleague they can text.&rdquo;</span>
        </motion.blockquote>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(0,0,0,0.3)" }}
              className="bg-white rounded-2xl p-6 transition-shadow duration-300"
            >
              <div className="text-3xl mb-4">{card.icon}</div>
              <h3 className="font-bold text-[#0A2E2A] text-lg mb-2">{card.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
