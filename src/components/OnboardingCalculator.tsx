import React, { useState } from "react";
import { AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, Leaf } from "lucide-react";
import { CalculatedResults } from "../types";
import { calculateFootprint } from "../utils/carbonUtils";
import { MobilityStep } from "./ui/MobilityStep";
import { DietStep } from "./ui/DietStep";
import { EnergyStep } from "./ui/EnergyStep";

interface CalculatorProps {
  onComplete: (data: CalculatedResults) => void;
}

export default function OnboardingCalculator({ onComplete }: CalculatorProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [transportType, setTransportType] = useState<string>("petrol");
  const [distance, setDistance] = useState<number>(600); // km per month
  const [dietType, setDietType] = useState<string>("moderate_meat");
  const [electricity, setElectricity] = useState<number>(200); // kWh per month
  const [heatingType, setHeatingType] = useState<string>("gas");

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
    } else {
      const results = calculateFootprint({
        transportType,
        distance,
        dietType,
        electricity,
        heatingType
      });
      onComplete(results);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const skipToStep = (targetStep: 1 | 2 | 3) => {
    if (targetStep < step) {
      setStep(targetStep);
    }
  };

  // Step information
  const stepsMeta = [
    { id: 1, title: "Mobility", desc: "Your fuel type and driving patterns" },
    { id: 2, title: "Dietary Choices", desc: "Your primary nutritional footprint" },
    { id: 3, title: "Household Energy", desc: "Electricity usage & heating fuels" }
  ];

  return (
    <section id="calculator-onboarding-container" aria-labelledby="calculator-title" className="w-full max-w-2xl mx-auto bg-stone-50 rounded-2xl border border-stone-200 shadow-xl overflow-hidden self-center my-6">
      {/* Structural Earth Header */}
      <header id="calculator-header" className="p-6 md:p-8 bg-emerald-950 text-stone-100 flex flex-col justify-between border-b border-stone-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-800 text-emerald-300 rounded-lg" aria-hidden="true">
              <Leaf className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 id="calculator-title" className="text-xl md:text-2xl font-semibold tracking-tight">Set up your Baseline</h1>
              <p className="text-xs text-emerald-400">Monthly calculator to construct your personalized dashboard</p>
            </div>
          </div>
          <span className="self-start md:self-auto text-xs font-semibold py-1 px-3 rounded-full bg-emerald-800 text-emerald-300 border border-emerald-700" aria-live="polite">
            Step {step} of 3
          </span>
        </div>

        {/* Step dots with names */}
        <nav aria-label="Calculator Progress" id="step-timeline" className="grid grid-cols-3 gap-2">
          {stepsMeta.map((s) => {
            const isActive = step === s.id;
            const isCompleted = step > s.id;
            return (
              <button
                key={s.id}
                id={`timeline-step-btn-${s.id}`}
                onClick={() => skipToStep(s.id as 1 | 2 | 3)}
                disabled={step <= s.id}
                aria-current={isActive ? "step" : undefined}
                className="text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                    isActive 
                      ? "bg-emerald-500 text-emerald-950 scale-110 shadow-lg" 
                      : isCompleted 
                      ? "bg-emerald-700 text-emerald-100" 
                      : "bg-emerald-900 text-emerald-600"
                  }`}>
                    {s.id}
                  </div>
                  <span className={`text-xs font-semibold transition-colors duration-300 ${
                    isActive ? "text-emerald-300" : isCompleted ? "text-emerald-400 group-hover:text-emerald-200" : "text-emerald-700"
                  }`}>
                    {s.title}
                  </span>
                </div>
                <div className="w-full bg-emerald-900/50 h-1 rounded-full overflow-hidden" aria-hidden="true">
                  <div className={`height-full h-1 bg-emerald-500 transition-all duration-300 ${
                    isActive ? "w-1/2" : isCompleted ? "w-full" : "w-0"
                  }`} />
                </div>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Screen Body with Framer Motion slide animation */}
      <div id="calculator-step-body" className="p-6 md:p-8 min-h-[360px] bg-white">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <MobilityStep
              transportType={transportType}
              setTransportType={setTransportType}
              distance={distance}
              setDistance={setDistance}
            />
          )}

          {step === 2 && (
            <DietStep dietType={dietType} setDietType={setDietType} />
          )}

          {step === 3 && (
            <EnergyStep
              electricity={electricity}
              setElectricity={setElectricity}
              heatingType={heatingType}
              setHeatingType={setHeatingType}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Button Controls Footer Panel */}
      <footer id="calculator-footer" className="p-5 md:p-6 bg-stone-100 border-t border-stone-200 flex justify-between items-center">
        <button
          id="back-step-btn"
          type="button"
          onClick={handleBack}
          disabled={step === 1}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
            step === 1
              ? "text-stone-300 bg-stone-50 border border-stone-200 cursor-not-allowed"
              : "text-stone-700 bg-white border border-stone-305 hover:bg-stone-50"
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Back
        </button>

        <button
          id="next-step-btn"
          type="button"
          onClick={handleNext}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-950 shadow transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
        >
          {step === 3 ? (
            <>
              Let's Carbon Audit!
              <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
            </>
          ) : (
            <>
              Next Step
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </>
          )}
        </button>
      </footer>
    </section>
  );
}
