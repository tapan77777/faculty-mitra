'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function AppLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center gap-6">
      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-[#635BFF]/10"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.15, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-16 h-16 rounded-full bg-[#635BFF]/20"
          animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0.25, 0.8] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#635BFF] to-[#5851DB] flex items-center justify-center shadow-xl">
          <Sparkles className="w-6 h-6 text-white" strokeWidth={1.5} />
        </div>
      </div>

      <div className="text-center">
        <p className="text-base font-semibold text-[#0A2540]">FacultyMitra</p>
        <p className="text-sm text-[#8898AA] mt-1">{message}</p>
      </div>
    </div>
  );
}
