import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// --- Background Image Assets for Pinned Layer Scrubbing ---
const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=2000', // Layer 1: Headlight Close-up
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=2000', // Layer 2: Aerial Top-Down
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000', // Layer 3: 5-Car Lineup
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=2000', // Layer 4: Rear CTA
];

// --- Border Beam Button with Dynamic Hover Glow ---
function BorderBeamButton({ children, onClick, className = '' }) {
  return (
    <div className={`relative inline-flex items-center justify-center p-[2px] overflow-hidden rounded-full group cursor-pointer transition-transform duration-300 hover:scale-105 ${className}`}>
      {/* Rotating Conic Gradient Border Trace */}
      <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] group-hover:animate-[spin_1.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0000_0%,#0000_60%,#DC2626_85%,#FFFFFF_100%)] opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Radial Hover Glow */}
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md bg-red-600/50 pointer-events-none" />

      {/* Button Body */}
      <button
        onClick={onClick}
        className="relative z-10 w-full h-full px-9 py-4 text-xs font-bold uppercase tracking-[0.25em] text-white bg-[#0B0B0C]/90 backdrop-blur-md rounded-full group-hover:bg-red-600 group-hover:shadow-[0_0_35px_rgba(220,38,38,0.8)] transition-all duration-300"
      >
        {children}
      </button>
    </div>
  );
}

// --- Animated Title Component (Red Glow -> Metallic White Stagger) ---
function AnimatedTitle({ title = "WELCOME ITZFIZZ", className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const letters = containerRef.current.querySelectorAll('.animated-letter');

    // Title entrance: Red drop/blur -> Crisp metallic white
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo(
      letters,
      {
        y: 80,
        opacity: 0,
        color: '#EF4444', // Red glow start
        textShadow: '0px 0px 30px rgba(239, 68, 68, 0.9), 0px 0px 60px rgba(239, 68, 68, 0.6)',
        filter: 'blur(10px)',
      },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.0,
        stagger: 0.04,
      }
    )
    .to(
      letters,
      {
        color: '#FFFFFF', // Transition into clean white
        textShadow: '0px 0px 0px rgba(0,0,0,0)',
        duration: 0.8,
        stagger: 0.03,
        ease: 'power2.inOut',
      },
      '-=0.4'
    );

    return () => tl.kill();
  }, []);

  const words = title.split(" ");

  return (
    <h1
      ref={containerRef}
      className={`flex flex-wrap justify-center items-center gap-x-6 gap-y-2 overflow-hidden py-4 ${className}`}
    >
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-flex overflow-hidden">
          {word.split("").map((char, charIdx) => (
            <span
              key={charIdx}
              className="animated-letter inline-block font-serif font-black uppercase tracking-[0.2em] transform-gpu will-change-transform"
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

// --- Main Application Component ---
export default function App() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: -500, y: -500 });

  const mainContainerRef = useRef(null);
  
  // Background layer refs
  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const layer3Ref = useRef(null);
  const layer4Ref = useRef(null);

  // Moving car ref
  const movingCarRef = useRef(null);

  // Header & stats refs
  const headlineRef = useRef(null);
  const statsRef = useRef(null);

  // 1. Preload Background Images
  useEffect(() => {
    let loadedCount = 0;
    const total = BACKGROUND_IMAGES.length;

    BACKGROUND_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / total) * 100));
        if (loadedCount === total) {
          setTimeout(() => setImagesLoaded(true), 300);
        }
      };
    });
  }, []);

  // 2. Setup Lenis Smooth Scroll & GSAP ScrollTrigger Sequence
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // Numerical Stats Entrance Animation
      gsap.fromTo(
        statsRef.current?.children || [],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.8 }
      );

      // --- MOVING CAR.PNG ANIMATION (Hero to Previous Builds) ---
      // Starts small near top hero title and moves down while expanding into Section 2
      gsap.fromTo(
        movingCarRef.current,
        {
          y: '0vh',
          scale: 0.35,
          opacity: 0.9,
        },
        {
          scrollTrigger: {
            trigger: mainContainerRef.current,
            start: 'top top',
            end: '50% top',
            scrub: 1,
          },
          y: '110vh', // Moves down through the page
          scale: 0.85, // Expands in size
          opacity: 1,
          ease: 'power1.inOut',
        }
      );

      // --- MASTER PINNED BACKGROUND SCRUB TIMELINE ---
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: mainContainerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      scrollTl
        // Phase 1 -> 2: Layer 1 crossfades to Layer 2
        .to(layer1Ref.current, { scale: 1.0, duration: 1, ease: 'none' }, 0)
        .to(layer1Ref.current, { opacity: 0, duration: 1, ease: 'power1.inOut' }, 1)
        .fromTo(layer2Ref.current, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1.0, duration: 1, ease: 'power1.inOut' }, 1)
        
        // Phase 2 -> 3: Layer 2 crossfades to Layer 3
        .to(layer2Ref.current, { opacity: 0, duration: 1, ease: 'power1.inOut' }, 2)
        .fromTo(layer3Ref.current, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1.0, duration: 1, ease: 'power1.inOut' }, 2)
        
        // Phase 3 -> 4: Layer 3 crossfades to Layer 4
        .to(layer3Ref.current, { opacity: 0, duration: 1, ease: 'power1.inOut' }, 3)
        .fromTo(layer4Ref.current, { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1.0, duration: 1, ease: 'power1.inOut' }, 3);

      // Hero Title Fade Out on Scroll
      gsap.to([headlineRef.current, statsRef.current], {
        scrollTrigger: {
          trigger: mainContainerRef.current,
          start: 'top top',
          end: '20% top',
          scrub: true,
        },
        opacity: 0,
        y: -50,
        ease: 'none',
      });

    }, mainContainerRef);

    return () => {
      ctx.revert();
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  // Spotlight Cursor Tracking
  useEffect(() => {
    const handleMouseMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={mainContainerRef} className="relative bg-[#0B0B0C] text-white font-sans selection:bg-red-600 selection:text-white min-h-[400vh] overflow-x-hidden">
      
      {/* PRELOADER OVERLAY */}
      {!imagesLoaded && (
        <div className="fixed inset-0 z-50 bg-[#0B0B0C] flex flex-col items-center justify-center text-white space-y-4 transition-opacity duration-500">
          <span className="font-serif text-sm tracking-[0.5em] uppercase text-neutral-400">
            WELCOME ITZFIZZ
          </span>
          <div className="w-48 h-[2px] bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 transition-all duration-200"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <p className="text-[10px] tracking-widest text-neutral-500 font-mono">
            LOADING ASSETS ({loadProgress}%)
          </p>
        </div>
      )}

      {/* MOUSE SPOTLIGHT GLOW OVERLAY */}
      <div
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: `
            radial-gradient(250px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(220, 38, 38, 0.15), transparent 80%),
            radial-gradient(700px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(255, 255, 255, 0.1), transparent 75%)
          `,
        }}
      />

      {/* FIXED PINNED BACKGROUND LAYER STACK */}
      <div className="fixed inset-0 w-screen h-screen z-0 overflow-hidden bg-[#0B0B0C] pointer-events-none">
        <img
          ref={layer1Ref}
          src={BACKGROUND_IMAGES[0]}
          alt="Layer 1 - Red Headlight Close-up"
          className="absolute inset-0 w-full h-full object-cover scale-108 will-change-transform opacity-1 transform-gpu"
        />
        <img
          ref={layer2Ref}
          src={BACKGROUND_IMAGES[1]}
          alt="Layer 2 - Porsche Aerial View"
          className="absolute inset-0 w-full h-full object-cover will-change-transform opacity-0 transform-gpu"
        />
        <img
          ref={layer3Ref}
          src={BACKGROUND_IMAGES[2]}
          alt="Layer 3 - 5-Car Lineup Front"
          className="absolute inset-0 w-full h-full object-cover will-change-transform opacity-0 transform-gpu"
        />
        <img
          ref={layer4Ref}
          src={BACKGROUND_IMAGES[3]}
          alt="Layer 4 - 3-Car Rear View"
          className="absolute inset-0 w-full h-full object-cover will-change-transform opacity-0 transform-gpu"
        />

        {/* Texture Vignette Overlay */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.85) 100%),
              rgba(0, 0, 0, 0.45)
            `
          }}
        />
      </div>

      {/* MOVING CAR.PNG ELEMENT (Fixed position, moves down & grows as you scroll) */}
      <div className="fixed top-[28vh] left-0 right-0 z-30 flex justify-center pointer-events-none">
        <img
          ref={movingCarRef}
          src={`${import.meta.env.BASE_URL}car.png`}
          alt="Car Motion Element"
          className="max-w-[80vw] md:max-w-[900px] h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.9)] transform-gpu will-change-transform"
          onError={(e) => {
            // Fallback image if car.png is missing in local dev directory
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1000";
          }}
        />
      </div>

      {/* FOREGROUND CONTENT SECTIONS */}
      <div className="relative z-20 w-full">
        
        {/* SECTION 1: HERO */}
        <section className="h-screen w-full flex flex-col justify-between items-center px-6 py-10 max-w-7xl mx-auto">
          <header className="w-full flex justify-between items-center border-b border-white/10 pb-6">
            <span className="font-serif text-lg md:text-xl font-bold tracking-[0.4em] uppercase text-white hover:text-red-600 transition-colors duration-300 cursor-pointer">
              WELCOME ITZFIZZ
            </span>
            <a
              href="#footer-cta"
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest border border-white/20 rounded-full backdrop-blur-md bg-black/40 hover:border-red-600 hover:bg-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all duration-300"
            >
              Inquire
            </a>
          </header>

          <div ref={headlineRef} className="text-center my-auto z-10">
            <p className="text-red-500 font-bold tracking-[0.4em] uppercase text-xs mb-2 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
              Interactive Precision Engineering
            </p>

            {/* STAGGERED RED TO WHITE TITLE ANIMATION */}
            <AnimatedTitle 
              title="WELCOME ITZFIZZ" 
              className="text-3xl md:text-7xl"
            />
          </div>

          <div ref={statsRef} className="w-full max-w-5xl grid grid-cols-3 gap-6 text-center border-t border-white/10 pt-6 backdrop-blur-sm bg-black/20 rounded-t-xl z-10">
            <div>
              <h2 className="text-2xl md:text-5xl font-extrabold text-white">0.24s</h2>
              <p className="text-[10px] md:text-xs text-neutral-400 uppercase tracking-[0.2em] mt-1">Response Time</p>
            </div>
            <div>
              <h2 className="text-2xl md:text-5xl font-extrabold text-red-500">1,020 HP</h2>
              <p className="text-[10px] md:text-xs text-neutral-400 uppercase tracking-[0.2em] mt-1">Peak Output</p>
            </div>
            <div>
              <h2 className="text-2xl md:text-5xl font-extrabold text-white">100%</h2>
              <p className="text-[10px] md:text-xs text-neutral-400 uppercase tracking-[0.2em] mt-1">Scroll Sync</p>
            </div>
          </div>
        </section>

        {/* SECTION 2: PREVIOUS BUILDS */}
        <section className="h-screen w-full flex flex-col items-center justify-center text-center px-6 max-w-7xl mx-auto space-y-8">
          <h2 className="font-serif text-5xl md:text-8xl font-bold tracking-wide text-white hover:text-red-500 transition-colors duration-500">
            Previous Builds
          </h2>
          <p className="text-neutral-300 text-xs md:text-sm uppercase tracking-[0.2em] max-w-2xl leading-relaxed backdrop-blur-sm bg-black/40 p-4 rounded-lg border border-white/10">
            A collection of previous bespoke builds shaped by craft, character, and the people behind the wheel.
          </p>
          <div>
            <BorderBeamButton>
              EXPLORE BUILDS
            </BorderBeamButton>
          </div>
        </section>

        {/* SECTION 3: AVAILABLE STOCK */}
        <section className="h-screen w-full flex flex-col items-center justify-center text-center px-6 max-w-7xl mx-auto space-y-8">
          <h2 className="font-serif text-5xl md:text-8xl font-bold tracking-wide text-white hover:text-red-500 transition-colors duration-500">
            Available Stock
          </h2>
          <p className="text-neutral-300 text-xs md:text-sm uppercase tracking-[0.2em] max-w-2xl leading-relaxed backdrop-blur-sm bg-black/40 p-4 rounded-lg border border-white/10">
            Builds available for purchase, refined with intent, engineered with passion, and ready to make a statement.
          </p>
          <div>
            <BorderBeamButton>
              BROWSE STOCK
            </BorderBeamButton>
          </div>
        </section>

        {/* SECTION 4: FOOTER CTA */}
        <section id="footer-cta" className="h-screen w-full flex flex-col justify-between items-center px-6 py-12 max-w-7xl mx-auto">
          <div className="w-full h-full flex flex-col items-center justify-center text-center my-auto space-y-6">
            <p className="text-red-500 uppercase tracking-[0.4em] text-xs font-bold drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
              ARE YOU READY TO
            </p>
            <h2 className="font-serif text-6xl md:text-9xl font-bold tracking-tight text-white hover:scale-105 transition-transform duration-500">
              Refuse Ordinary
            </h2>
            <div className="pt-4">
              <BorderBeamButton>
                START YOUR PROJECT
              </BorderBeamButton>
            </div>
          </div>

          <footer className="w-full flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-6 text-xs text-neutral-400">
            <p>© {new Date().getFullYear()} WELCOME ITZFIZZ. All rights reserved.</p>
            <button
              onClick={scrollToTop}
              className="uppercase tracking-widest text-neutral-400 hover:text-red-500 transition-colors duration-200"
            >
              BACK TO TOP ↑
            </button>
          </footer>
        </section>

      </div>

    </div>
  );
}
