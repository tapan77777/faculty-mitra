"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  from: "user" | "bot";
  text: string;
}

const scenarios: {
  id: string;
  label: string;
  emoji: string;
  tag: string;
  messages: Message[];
}[] = [
  {
    id: "syllabus",
    label: "Paste Syllabus",
    emoji: "📄",
    tag: "Get relevance audit + score",
    messages: [
      {
        from: "user",
        text: "Unit 1: OSI Model\nUnit 2: TCP/IP Protocols\nUnit 3: Token Ring (IEEE 802.5)\nUnit 4: ATM Networks\nUnit 5: IPv4 Subnetting\n\nCan you check my Networking syllabus?",
      },
      {
        from: "bot",
        text: "📊 *Syllabus Relevance Audit*\n\n*Overall Score: 54/100* ⚠️\n\n━━━━━━━━━━━━━━━━━━\nUnit 1: OSI Model ✅ *Relevant*\n→ Still foundational. Keep it.\n\nUnit 2: TCP/IP Protocols ✅ *Core*\n→ Add HTTP/2, QUIC, WebSockets\n\nUnit 3: Token Ring ❌ *Obsolete*\n→ Retired in 2003. Replace with\n   WiFi 6 / Ethernet standards\n\nUnit 4: ATM Networks ❌ *Obsolete*\n→ No industry use. Replace with\n   SD-WAN, MPLS, Cloud Networking\n\nUnit 5: IPv4 Subnetting ⚠️ *Partial*\n→ Add IPv6, CIDR, NAT concepts\n━━━━━━━━━━━━━━━━━━\n*Suggestion:* Add Cloud Networking,\nDocker networking, REST APIs. 🎯",
      },
    ],
  },
  {
    id: "assignment",
    label: "Generate Assignment",
    emoji: "✍️",
    tag: "For SQL, BCA 3rd sem",
    messages: [
      {
        from: "user",
        text: "Generate a practical SQL joins assignment for BCA 3rd semester students.",
      },
      {
        from: "bot",
        text: "📝 *Practical Assignment: SQL Joins*\n*BCA 3rd Sem · Difficulty: Medium*\n\n*Scenario: College Library System*\nYou manage a library DB with tables:\n`Books`, `Members`, `BorrowRecords`\n\n*Tasks:*\n\n1️⃣ Use INNER JOIN to list all books\n   currently borrowed with member names\n\n2️⃣ Use LEFT JOIN to find members who\n   have *never* borrowed a book\n\n3️⃣ Use JOIN + GROUP BY to find the\n   top 5 most borrowed books\n\n*Real-World Connect:* 🔗\nSwiggy uses similar JOINs to match\norderId → restaurantId → driverID\nin their delivery tracking system.\n\n*Submission:* SQL file + screenshot\nof query output. Due: 1 week. ✅",
      },
    ],
  },
  {
    id: "topic",
    label: "Topic Check",
    emoji: "🔍",
    tag: "Is blockchain worth teaching?",
    messages: [
      {
        from: "user",
        text: "Should I teach Blockchain to my BCA students? Is it still relevant?",
      },
      {
        from: "bot",
        text: "⛓️ *Topic Check: Blockchain*\n*Verdict: Partially Relevant* ⚠️\n\n*Teach it — but smartly:*\n\n✅ Concepts worth teaching (1 class):\n→ What blockchain is (distributed ledger)\n→ Why it matters (transparency, trust)\n→ Hash functions, consensus basics\n\n🌍 *Real use cases in India:*\n→ NPCI UPI transaction ledger\n→ UIDAI Aadhaar verification chain\n→ DigiLocker document verification\n\n❌ *Skip for non-CS students:*\n→ Solidity / Smart contracts coding\n→ Mining algorithms (too deep)\n→ DeFi / NFT speculation\n\n💡 *Recommendation:*\n1 class overview. Focus on the WHY,\nnot the HOW. Industry wants concept\nawareness, not blockchain developers. 🎯",
      },
    ],
  },
  {
    id: "hindi",
    label: "Hindi Support",
    emoji: "🇮🇳",
    tag: "Regional language request",
    messages: [
      {
        from: "user",
        text: "Mujhe BCA ke liye networking ka practical assignment chahiye. Hindi mein explain karo.",
      },
      {
        from: "bot",
        text: "📡 *Networking Assignment — Hindi*\n*BCA · Madhyam Kasht Star*\n\n*Pariksha: VLAN Network Design*\n🛠️ *Tool: Cisco Packet Tracer (Free)*\n\n*Kaam kya karna hai:*\n\n1️⃣ Teen VLAN banao:\n   • VLAN 10 → Computer Lab\n   • VLAN 20 → Faculty Room\n   • VLAN 30 → Library\n\n2️⃣ Managed switch configure karo\n   har VLAN ke liye alag port ke sath\n\n3️⃣ Inter-VLAN routing setup karo\n   Router-on-a-stick method se\n\n*Practical Jankari:* 🏢\nBade offices mein alag departments\nalag VLANs par hote hain — security\naur performance dono ke liye.\n\n*Jama karo:* Packet Tracer file +\n2 screenshot (before/after config)\n*Samay:* 5 din ✅",
      },
    ],
  },
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-1 px-4 py-3 bg-white rounded-2xl rounded-bl-sm shadow-sm max-w-[80px]">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-gray-400"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

function ChatBubble({ msg, index, timeStr }: { msg: Message; index: number; timeStr: string }) {
  const isUser = msg.from === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-[#DCF8C6] text-gray-800 rounded-br-sm"
            : "bg-white text-gray-800 rounded-bl-sm"
        }`}
        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
      >
        {msg.text.split(/(\*[^*]+\*)/g).map((part, i) =>
          part.startsWith("*") && part.endsWith("*") ? (
            <strong key={i}>{part.slice(1, -1)}</strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
        <div className={`flex items-center gap-1 mt-1 ${isUser ? "justify-end" : "justify-start"}`}>
          <span className="text-[10px] text-gray-400">{timeStr}</span>
          {isUser && <span className="text-[10px] text-blue-500">✓✓</span>}
        </div>
      </div>
    </motion.div>
  );
}

export default function WhatsAppDemo() {
  const [activeId, setActiveId] = useState("syllabus");
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeStr, setTimeStr] = useState("10:30 AM");
  const chatRef = useRef<HTMLDivElement>(null);

  const activeScenario = scenarios.find((s) => s.id === activeId)!;

  // Set time client-side only to avoid hydration mismatch
  useEffect(() => {
    setTimeStr(
      new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    );
  }, []);

  useEffect(() => {
    setIsTransitioning(true);
    setDisplayedMessages([]);
    setShowTyping(false);

    const t1 = setTimeout(() => {
      setIsTransitioning(false);
      setDisplayedMessages([activeScenario.messages[0]]);
      setShowTyping(true);
    }, 300);

    const t2 = setTimeout(() => {
      setShowTyping(false);
      setDisplayedMessages(activeScenario.messages);
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [activeId, activeScenario.messages]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [displayedMessages, showTyping]);

  return (
    <section id="demo" className="bg-white py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="text-xs font-bold tracking-[0.2em] text-[#0D9488] uppercase">
            See It In Action
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl font-extrabold text-[#0A2E2A] mb-3"
        >
          Tap a scenario. See a real conversation.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-gray-500 mb-10"
        >
          These are real responses FacultyMitra generates — not mockups.
        </motion.p>

        {/* Scenario buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-10 max-w-lg mx-auto"
        >
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                activeId === s.id
                  ? "border-[#0D9488] bg-[#0D9488]/5 shadow-md"
                  : "border-gray-100 bg-gray-50 hover:border-[#0D9488]/40"
              }`}
            >
              <div className="text-2xl mb-1.5">{s.emoji}</div>
              <div className="font-bold text-sm text-[#0A2E2A] mb-0.5">{s.label}</div>
              <div className="text-xs text-gray-400">{s.tag}</div>
            </button>
          ))}
        </motion.div>

        {/* Phone frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto max-w-sm"
        >
          <div className="rounded-[2.5rem] border-[6px] border-gray-800 shadow-2xl overflow-hidden bg-gray-800">
            {/* Notch */}
            <div className="bg-gray-800 flex justify-center py-2">
              <div className="w-20 h-3 bg-gray-900 rounded-full" />
            </div>

            {/* WhatsApp UI */}
            <div className="bg-white overflow-hidden">
              {/* Header */}
              <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">FM</span>
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm">FacultyMitra</div>
                  <div className="text-[#25D366] text-xs font-medium">● online</div>
                </div>
                <div className="flex gap-3 text-white/70 text-sm">
                  <span>📞</span>
                  <span>⋮</span>
                </div>
              </div>

              {/* Chat area */}
              <div
                ref={chatRef}
                className="h-[420px] overflow-y-auto p-3 flex flex-col gap-3"
                style={{ backgroundColor: "#ECE5DD" }}
              >
                <div className="flex justify-center">
                  <span className="text-[10px] text-gray-500 bg-white/70 px-3 py-1 rounded-full">
                    Today
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  {!isTransitioning && (
                    <motion.div
                      key={activeId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-3"
                    >
                      {displayedMessages.map((msg, i) => (
                        <ChatBubble key={i} msg={msg} index={i} timeStr={timeStr} />
                      ))}
                      {showTyping && (
                        <div className="flex justify-start">
                          <TypingIndicator />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input bar */}
              <div className="px-3 py-2 flex items-center gap-2 bg-[#F0F0F0]">
                <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-gray-400 border border-gray-200">
                  Type a message…
                </div>
                <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">🎤</span>
                </div>
              </div>
            </div>

            {/* Home bar */}
            <div className="bg-gray-800 flex justify-center py-2">
              <div className="w-24 h-1 bg-gray-600 rounded-full" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
