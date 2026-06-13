import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Car, Flame, Bolt, Salad, ArrowRight, ArrowLeft, Leaf } from "lucide-react";
import { CalculatedResults } from "../types";

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

  const calculateFootprint = (): CalculatedResults => {
    // 1. Transportation Calculation (kg CO2 per km)
    const transportFactors: Record<string, number> = {
      petrol: 0.192,
      diesel: 0.171,
      hybrid: 0.104,
      electric: 0.045, // grid average loading
      public: 0.035,   // generic bus/train combo
      bike_walk: 0.00
    };
    const transportEmissions = Math.round(distance * (transportFactors[transportType] ?? 0.192));

    // 2. Diet Calculation (Monthly averages in kg CO2)
    const dietFactors: Record<string, number> = {
      heavy_meat: 280,     // Heavy beef / lamb consumption
      moderate_meat: 190,  // Mixed poultry, pork, low beef
      low_meat: 120,       // Mostly vegan/vegetarian with occasional chicken or fish
      vegetarian: 85,      // Dairy and eggs, no flesh
      vegan: 50            // Direct plant pipeline
    };
    const dietEmissions = dietFactors[dietType] ?? 190;

    // 3. Home Energy Calculation (Monthly kg CO2)
    const electricityFactor = 0.35; // average grid index per kWh
    const heatingFlatRates: Record<string, number> = {
      gas: 140,
      electric: 80,
      biomass: 35,
      none: 0
    };
    const electricityEmissions = Math.round(electricity * electricityFactor);
    const heatingEmissions = heatingFlatRates[heatingType] ?? 140;
    const energyEmissions = electricityEmissions + heatingEmissions;

    const total = transportEmissions + dietEmissions + energyEmissions;

    return {
      transport: transportEmissions,
      diet: dietEmissions,
      energy: energyEmissions,
      total,
      answers: {
        transportType,
        distance,
        dietType,
        electricity,
        heatingType
      }
    };
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
    } else {
      const results = calculateFootprint();
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
    <div id="calculator-onboarding-container" className="w-full max-w-2xl mx-auto bg-stone-50 rounded-2xl border border-stone-200 shadow-xl overflow-hidden self-center my-6">
      {/* Structural Earth Header */}
      <div id="calculator-header" className="p-6 md:p-8 bg-emerald-950 text-stone-100 flex flex-col justify-between border-b border-stone-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-800 text-emerald-300 rounded-lg">
              <Leaf className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Set up your Baseline</h1>
              <p className="text-xs text-emerald-400">Monthly calculator to construct your personalized dashboard</p>
            </div>
          </div>
          <span className="self-start md:self-auto text-xs font-semibold py-1 px-3 rounded-full bg-emerald-800 text-emerald-300 border border-emerald-700">
            Step {step} of 3
          </span>
        </div>

        {/* Step dots with names */}
        <div id="step-timeline" className="grid grid-cols-3 gap-2">
          {stepsMeta.map((s) => {
            const isActive = step === s.id;
            const isCompleted = step > s.id;
            return (
              <button
                key={s.id}
                id={`timeline-step-btn-${s.id}`}
                onClick={() => skipToStep(s.id as 1 | 2 | 3)}
                disabled={step <= s.id}
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
                <div className="w-full bg-emerald-900/50 h-1 rounded-full overflow-hidden">
                  <div className={`height-full h-1 bg-emerald-500 transition-all duration-300 ${
                    isActive ? "w-1/2" : isCompleted ? "w-full" : "w-0"
                  }`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Screen Body with Framer Motion slide animation */}
      <div id="calculator-step-body" className="p-6 md:p-8 min-h-[360px] bg-white">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <Car className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-semibold text-stone-900">1. Select Commute Vehicle</h3>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Mobility emissions depend on engine efficiency and distance traveled. Tell us which transport gets you around.
              </p>

              <div id="transport-options" className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: "petrol", label: "Petrol Car", desc: "Regular gasoline motor" },
                  { id: "diesel", label: "Diesel Car", desc: "Averaging higher torque, high emissions" },
                  { id: "hybrid", label: "Hybrid", desc: "Fuel-electric combination efficiency" },
                  { id: "electric", label: "Electric Car", desc: "Eco friendly, charged on grid mix" },
                  { id: "public", label: "Public Transit", desc: "City bus, trains and subways" },
                  { id: "bike_walk", label: "Active Mode", desc: "Walking, cycling, or green scooter" }
                ].map((item) => {
                  const isSelected = transportType === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`transport-option-btn-${item.id}`}
                      type="button"
                      onClick={() => setTransportType(item.id)}
                      className={`p-3.5 text-left rounded-xl border transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                        isSelected
                          ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-medium"
                          : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100/50 hover:border-stone-300"
                      }`}
                    >
                      <p className="text-sm font-semibold text-emerald-950">{item.label}</p>
                      <p className="text-[11px] text-stone-550 leading-tight mt-1">{item.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-stone-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-stone-700">Estimated Monthly Distance Commuted</span>
                  <span className="text-sm font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                    {distance} km
                  </span>
                </div>
                <input
                  id="distance-slider"
                  type="range"
                  min="0"
                  max="3500"
                  step="50"
                  value={distance}
                  onChange={(e) => setDistance(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-700 focus:outline-none"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1 font-mono">
                  <span>0 km</span>
                  <span>1,500 km</span>
                  <span>3,500+ km</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <Salad className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-semibold text-stone-900">2. Define Dietary Preference</h3>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Agriculture contributes significantly to global greenhouse outputs. Choose a profile representing your nutritional routines:
              </p>

              <div id="dietary-options" className="space-y-2.5">
                {[
                  { id: "heavy_meat", label: "Frequent Meat (High Impact)", desc: "Beef, pork, or lamb is featured in almost every daily meal.", factorText: "~280 kg CO2/month" },
                  { id: "moderate_meat", label: "Moderate Meat (Average)", desc: "Eat poultry, pork or mixed meats on alternating days.", factorText: "~190 kg CO2/month" },
                  { id: "low_meat", label: "Low Meat / Flexitarian", desc: "Meals are pre-eminently plant-based with infrequent meat.", factorText: "~120 kg CO2/month" },
                  { id: "vegetarian", label: "Lacto-Ovo Vegetarian", desc: "No poultry or red meats. Consumes eggs, milk products, and cheeses.", factorText: "~85 kg CO2/month" },
                  { id: "vegan", label: "Plant-Based (Vegan)", desc: "Zero animal intake. Relies entirely on grains, legumes, and produce.", factorText: "~50 kg CO2/month" }
                ].map((option) => {
                  const isSelected = dietType === option.id;
                  return (
                    <button
                      key={option.id}
                      id={`diet-option-btn-${option.id}`}
                      type="button"
                      onClick={() => setDietType(option.id)}
                      className={`w-full p-3.5 text-left rounded-xl border flex justify-between items-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                        isSelected
                          ? "bg-emerald-55 border-emerald-600 text-emerald-950 font-medium"
                          : "bg-stone-50 border-stone-200 text-stone-705 hover:bg-stone-100/50 hover:border-stone-300"
                      }`}
                    >
                      <div className="max-w-[70%] text-left">
                        <p className="text-sm font-semibold text-emerald-950">{option.label}</p>
                        <p className="text-xs text-stone-500 mt-0.5 leading-snug">{option.desc}</p>
                      </div>
                      <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded ${
                        isSelected ? "bg-emerald-250 text-emerald-800" : "bg-stone-200/50 text-stone-600"
                      }`}>
                        {option.factorText}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <Flame className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-semibold text-stone-900">3. Household Power & Thermal Heating</h3>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed font-sans">
                Residential lighting, power lines, heating, and cooling system efficiency drive secondary electricity carbon scores.
              </p>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5">
                    <Bolt className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-stone-705">Average Monthly Electric Bill</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-emerald-700 bg-emerald-55 px-2.5 py-1 rounded border border-emerald-100">
                    {electricity} kWh
                  </span>
                </div>
                <input
                  id="electricity-slider"
                  type="range"
                  min="0"
                  max="800"
                  step="20"
                  value={electricity}
                  onChange={(e) => setElectricity(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-700 focus:outline-none"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1 font-mono">
                  <span>0 kWh (Net Zero/Solar)</span>
                  <span>400 kWh</span>
                  <span>800+ kWh (Large Household)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <label className="block text-xs font-semibold text-stone-705 mb-2.5">
                  How is your home primarily heated?
                </label>
                <div id="heating-options" className="grid grid-cols-2 gap-3">
                  {[
                    { id: "gas", label: "Natural Gas", desc: "Boiler burner heating" },
                    { id: "electric", label: "Electric/Heat Pump", desc: "Thermodynamic heat transfers" },
                    { id: "biomass", label: "Biomass / Pellet", desc: "Raw wood or thermal pellets" },
                    { id: "none", label: "No Heating", desc: "Mild climates / zero thermal heating" }
                  ].map((option) => {
                    const isSelected = heatingType === option.id;
                    return (
                      <button
                        key={option.id}
                        id={`heating-option-btn-${option.id}`}
                        type="button"
                        onClick={() => setHeatingType(option.id)}
                        className={`p-3 text-left rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                          isSelected
                            ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-medium"
                            : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100/50 hover:border-stone-300"
                        }`}
                      >
                        <p className="text-sm font-semibold text-emerald-950">{option.label}</p>
                        <p className="text-[11px] text-stone-500 mt-0.5 leading-tight">{option.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Button Controls Footer Panel */}
      <div id="calculator-footer" className="p-5 md:p-6 bg-stone-100 border-t border-stone-200 flex justify-between items-center">
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
          <ArrowLeft className="w-3.5 h-3.5" />
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
              <Leaf className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
