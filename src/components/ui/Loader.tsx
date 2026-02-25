"use client";
import { useEffect, useState } from "react";

export default function StepLoader() {
  const steps = [
    "Analyzing...",
    "Fetching latest data...",
    "Processing...",
    "Optimizing...",
    "Loading modules...",
    "Finalizing...",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % steps.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-6">
     
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[var(--border)] border-t-transparent"></div>

      <p key={current} className="animate-fadeIn mt-4 text-base font-medium opacity-0">
        {steps[current]}
      </p>
    </div>
  );
}
