import React from 'react';
import { motion, useTransform } from 'framer-motion';

export default function ScrollHint({ scrollProgress }) {
  const opacity = useTransform(scrollProgress, [0, 0.2], [1, 0]);

  return (
    <motion.div style={{ opacity }} className="flex flex-col items-center space-y-2 text-neutral-400">
      <span className="text-[10px] uppercase font-mono tracking-widest">Scroll to Accelerate</span>
      <div className="w-5 h-9 border-2 border-neutral-600 rounded-full flex justify-center p-1">
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-1 h-2 bg-red-500 rounded-full"
        />
      </div>
    </motion.div>
  );
}