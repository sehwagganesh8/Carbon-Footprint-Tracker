import React, { Suspense } from "react";
import { motion } from "motion/react";
import { Globe } from "lucide-react";

interface OnboardingHeroProps {
  handleOnboardingComplete: (data: any) => void;
  OnboardingCalculator: React.ComponentType<any>;
}

export function OnboardingHero({ handleOnboardingComplete, OnboardingCalculator }: OnboardingHeroProps) {
  return (
    <motion.section
      key="onboarding-space"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col justify-center items-center py-6"
      aria-labelledby="onboarding-heading"
    >
      <header className="text-center max-w-xl mx-auto mb-8 space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-bold uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          <Globe className="w-3.5 h-3.5 text-emerald-700 animate-spin" aria-hidden="true" />
          Eco-friendly Hackathon MVP
        </div>
        <h2 id="onboarding-heading" className="text-3xl md:text-4xl font-extrabold text-stone-900 font-serif tracking-tight">
          Discover Your Carbon Footprint
        </h2>
        <p className="text-sm text-stone-500 leading-relaxed max-w-md mx-auto">
          Take credit for your habits. Get immediate baseline metrics representing your diet, energy, and transportation, then log actions to lower your scores.
        </p>
      </header>

      {/* Onboarding Wizard element */}
      <Suspense fallback={<div className="p-8 text-center text-sm text-stone-500">Loading calculator...</div>}>
        <OnboardingCalculator onComplete={handleOnboardingComplete} />
      </Suspense>
    </motion.section>
  );
}
