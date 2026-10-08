import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useVelocity, useSpring } from 'framer-motion';
import { useCursorPosition } from '../hooks/useCursorPosition';
import { useReducedMotion } from '../hooks/useReducedMotion';
import Speedometer from './Speedometer';
import ScrollHint from './ScrollHint';
import carSvg from '../assets/car.svg';

export default function Hero() {
  const containerRef = useRef(null);
  const { cursorX, cursorY } = useCursorPosition();
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });

  const carScale = useTransform(scrollYProgress, [0, 1], [0.85, 1.3]);
  const carY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const titleLetterSpacing = useTransform(scrollYProgress, [0, 1], ['0.2em', '0.6em']);
  const opacityFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative h-[200vh] bg-neutral-950 text-white overflow-hidden"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between items-center px-6 py-10 overflow-hidden">
        
        <div 
          className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out opacity-20"
          style={{
            background: `radial-gradient(600px at ${cursorX}px ${cursorY}px, rgba(239, 68, 68, 0.15), transparent 80%)`
          }}
        />

        <motion.div 
          style={{ opacity: opacityFade }}
          className="z-10 text-center mt-6"
        >
          <motion.h1 
            style={{ letterSpacing: prefersReducedMotion ? '0.3em' : titleLetterSpacing }}
            className="text-4xl md:text-7xl font-extrabold uppercase tracking-widest bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent"
          >
            FORGE AUTOMOTIVE
          </motion.h1>
          <p className="text-xs md:text-sm text-neutral-400 mt-2 font-mono tracking-widest">
            PRECISION ENGINEERING & HIGH PERFORMANCE
          </p>
        </motion.div>

        <div className="relative w-full max-w-5xl flex justify-center items-center my-auto">
          <motion.img 
            src={carSvg} 
            alt="Forge Performance Vehicle"
            style={{ 
              scale: prefersReducedMotion ? 1 : carScale, 
              y: prefersReducedMotion ? 0 : carY 
            }}
            className="w-full max-w-3xl object-contain drop-shadow-[0_20px_50px_rgba(239,68,68,0.2)] select-none pointer-events-none"
          />
        </div>

        <div className="z-10 w-full max-w-6xl flex justify-between items-end pb-4 border-t border-neutral-800/60 pt-4">
          <Speedometer velocity={smoothVelocity} />
          <ScrollHint scrollProgress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}
 