'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const MESSAGES: Record<string, string[]> = {
  audit: [
    'Reading syllabus...',
    'Analyzing units...',
    'Checking industry data...',
    'Generating report...',
  ],
  assign: [
    'Understanding topic...',
    'Designing tasks...',
    'Building rubric...',
    'Adding industry context...',
  ],
  topic: [
    'Checking industry use cases...',
    'Evaluating career data...',
    'Building teach guide...',
    'Almost done...',
  ],
};

export default function AILoader({ type }: { type: 'audit' | 'assign' | 'topic' }) {
  const messages = MESSAGES[type];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 1800);
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div className="bg-white border border-[#E3E8EE] rounded-2xl p-8 shadow-sm flex flex-col items-center gap-5">
      {/* Pulsing indigo circle */}
      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute w-20 h-20 rounded-full bg-[#635BFF]/10"
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-14 h-14 rounded-full bg-[#635BFF]/15"
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.3, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#635BFF] to-[#5851DB] flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />
        </div>
      </div>

      {/* Rotating status text */}
      <div className="h-6 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-sm font-medium text-[#0A2540] text-center"
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      <p className="text-xs text-[#8898AA]">This usually takes 5–10 seconds</p>
    </div>
  );
}
