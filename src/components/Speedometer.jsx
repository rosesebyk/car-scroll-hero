import React, { useState, useEffect } from 'react';

export default function Speedometer({ velocity }) {
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    if (!velocity) return;

    return velocity.on('change', (v) => {
      const currentSpeed = Math.min(Math.abs(Math.round(v / 15)), 220);
      setSpeed(currentSpeed);
    });
  }, [velocity]);

  return (
    <div className="flex items-center space-x-3 font-mono bg-neutral-900/80 backdrop-blur border border-neutral-800 px-4 py-2 rounded-lg">
      <div className="flex flex-col">
        <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Velocity</span>
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold text-red-500 w-12 text-right">{speed}</span>
          <span className="text-xs text-neutral-400">MPH</span>
        </div>
      </div>
    </div>
  );
}