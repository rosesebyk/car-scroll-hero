import React from 'react';

export default function BorderBeamButton({ 
  children, 
  onClick, 
  beamColorFrom = '#DC2626', 
  beamColorTo = '#FFFFFF', 
  className = '' 
}) {
  return (
    <div className={`relative inline-block rounded-full p-[1px] overflow-hidden ${className}`}>
      {/* Animated Border Beam Trace */}
      <div
        className="absolute inset-0 pointer-events-none rounded-full animate-border-beam"
        style={{
          offsetPath: 'rect(0% auto 100% auto round 9999px)',
          background: `linear-gradient(to right, ${beamColorFrom}, ${beamColorTo}, transparent)`,
          width: '60px',
          height: '100%',
        }}
      />

      {/* Button Content Container */}
      <button
        onClick={onClick}
        className="relative z-10 w-full h-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white border border-white/20 rounded-full backdrop-blur-md bg-black/70 hover:bg-red-600 hover:border-red-600 transition-all duration-300"
      >
        {children}
      </button>
    </div>
  );
}