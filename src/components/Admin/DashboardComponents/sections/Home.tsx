"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function Home() {
  useEffect(() => {
    // Fire confetti after 1 second
    const timer = setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ef4444", "#b91c1c", "#7f1d1d"],
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-white overflow-hidden">
      <h1
        className="text-5xl md:text-7xl lg:text-8xl font-black text-center text-red-900 
                     tracking-tight select-none
                     animate-fade-in animate-scale-up animate-rotate-once
                     drop-shadow-[0_0_8px_rgba(185,28,28,0.6)]
                     hover:drop-shadow-[0_0_12px_rgba(185,28,28,0.8)]
                     transition-all duration-300"
      >
        #LiveToExpress
      </h1>
    </div>
  );
}
