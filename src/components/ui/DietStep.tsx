import React from "react";
import { motion } from "motion/react";
import { Salad } from "lucide-react";

interface DietStepProps {
  dietType: string;
  setDietType: (v: string) => void;
}

export function DietStep({ dietType, setDietType }: DietStepProps) {
  return (
    <motion.fieldset
      key="step-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-5 block border-0 p-0 m-0"
    >
      <legend className="flex items-center gap-2.5 mb-2 w-full">
        <Salad className="w-5 h-5 text-emerald-700" aria-hidden="true" />
        <h3 className="text-base font-semibold text-stone-900">2. Define Dietary Preference</h3>
      </legend>
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
              aria-pressed={isSelected}
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
              }`} aria-hidden="true">
                {option.factorText}
              </span>
            </button>
          );
        })}
      </div>
    </motion.fieldset>
  );
}
