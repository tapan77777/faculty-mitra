'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, Loader2, Circle } from 'lucide-react';

const FEATURE_CONFIG = {
  audit: {
    messages: [
      'Reading your syllabus...',
      'Identifying key topics...',
      'Checking NASSCOM 2024 data...',
      'Cross-referencing industry signals...',
      'Scoring relevance...',
      'Generating recommendations...',
      'Almost done...',
    ],
    steps: [
      'Parsed syllabus structure',
      'Identified subject context',
      'Checking NASSCOM industry data',
      'Cross-referencing employer signals',
      'Generating unit-by-unit recommendations',
    ],
  },
  assign: {
    messages: [
      'Understanding your topic...',
      'Finding industry context...',
      'Designing assignment structure...',
      'Adding Indian company examples...',
      'Generating evaluation rubric...',
      'Final touches...',
    ],
    steps: [
      'Understood topic context',
      'Found industry use cases',
      'Designed assignment structure',
      'Generated evaluation rubric',
      'Finalized with Indian examples',
    ],
  },
  topic: {
    messages: [
      'Analyzing your question...',
      'Checking current hiring data...',
      'Comparing with industry priorities...',
      'Forming a verdict...',
      'Writing reasoning...',
    ],
    steps: [
      'Analyzed the question',
      'Checked current hiring data',
      'Compared industry priorities',
      'Formed a verdict',
      'Wrote detailed reasoning',
    ],
  },
};

interface Props {
  feature: 'audit' | 'assign' | 'topic';
  estimatedSeconds?: number;
  done?: boolean;
  onComplete?: () => void;
}

export default function AIThinkingLoader({
  feature,
  estimatedSeconds = 10,
  done = false,
  onComplete,
}: Props) {
  const config = FEATURE_CONFIG[feature];
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  // Progress bar: 0 → 95% over estimatedSeconds, jump to 100% when done
  useEffect(() => {
    if (done) {
      setProgress(100);
      return;
    }
    const startTime = Date.now();
    const duration = estimatedSeconds * 1000;
    const id = setInterval(() => {
      const pct = Math.min(95, ((Date.now() - startTime) / duration) * 95);
      setProgress(pct);
      if (pct >= 95) clearInterval(id);
    }, 50);
    return () => clearInterval(id);
  }, [done, estimatedSeconds]);

  // Cycle heading messages every 2.5s
  useEffect(() => {
    if (done) {
      setMessageIndex(config.messages.length - 1);
      return;
    }
    const id = setInterval(() => {
      setMessageIndex((i) => (i + 1) % config.messages.length);
    }, 2500);
    return () => clearInterval(id);
  }, [done, config.messages.length]);

  // Advance checklist steps every 2s
  useEffect(() => {
    if (done) {
      setActiveStep(config.steps.length);
      return;
    }
    const timers = config.steps.map((_, i) =>
      i === 0 ? null : setTimeout(() => setActiveStep(i), i * 2000)
    );
    return () => timers.forEach((t) => t && clearTimeout(t));
  }, [done, config.steps.length]);

  // Fire onComplete 400ms after done=true (completion celebration window)
  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => onComplete?.(), 400);
    return () => clearTimeout(id);
  }, [done, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/30 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md"
      >
        {/* Animated sparkles */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ rotate: [0, 8, -8, 8, 0], scale: [1, 1.12, 1, 1.12, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="w-10 h-10 text-[#635BFF]" strokeWidth={1.5} />
          </motion.div>
        </div>

        {/* Cycling heading */}
        <div className="h-7 flex items-center justify-center mb-5 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="text-base font-semibold text-[#0A2540] text-center"
            >
              {config.messages[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600"
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.4 }}
          />
        </div>

        {/* Checklist */}
        <div className="space-y-3 mb-7">
          {config.steps.map((step, i) => {
            const isComplete = activeStep > i;
            const isActive = activeStep === i;
            return (
              <motion.div
                key={i}
                animate={{ scale: isActive ? [1, 1.015, 1] : 1 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center gap-3 text-sm transition-colors duration-300 ${
                  isComplete
                    ? 'text-slate-900'
                    : isActive
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {isComplete ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" strokeWidth={2} />
                  </motion.div>
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-[#635BFF] animate-spin flex-shrink-0" strokeWidth={2} />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" strokeWidth={1.5} />
                )}
                {step}
              </motion.div>
            );
          })}
        </div>

        {/* Reassurance */}
        <p className="text-sm text-slate-500 italic text-center">
          Usually takes {estimatedSeconds} seconds
        </p>
      </motion.div>
    </motion.div>
  );
}
