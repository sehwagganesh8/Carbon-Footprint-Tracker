import React from "react";
import { motion } from "motion/react";
import { Flame, Bolt } from "lucide-react";

interface EnergyStepProps {
  electricity: number;
  setElectricity: (v: number) => void;
  heatingType: string;
  setHeatingType: (v: string) => void;
}

export function EnergyStep({
  electricity,
  setElectricity,
  heatingType,
  setHeatingType
}: EnergyStepProps) {
  return (
    <motion.fieldset
      key="step-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 block border-0 p-0 m-0"
    >
      <legend className="flex items-center gap-2.5 mb-2 w-full">
        <Flame className="w-5 h-5 text-emerald-700" aria-hidden="true" />
        <h3 className="text-base font-semibold text-stone-900">3. Household Power & Thermal Heating</h3>
      </legend>
      <p className="text-xs text-stone-500 leading-relaxed font-sans">
        Residential lighting, power lines, heating, and cooling system efficiency drive secondary electricity carbon scores.
      </p>

      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5">
            <Bolt className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <label htmlFor="electricity-slider" className="text-xs font-semibold text-stone-705">Average Monthly Electric Bill</label>
          </div>
          <span className="text-sm font-bold font-mono text-emerald-700 bg-emerald-55 px-2.5 py-1 rounded border border-emerald-100" aria-hidden="true">
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
          aria-valuemin={0}
          aria-valuemax={800}
          aria-valuenow={electricity}
        />
        <div className="flex justify-between text-[11px] text-stone-400 mt-1 font-mono" aria-hidden="true">
          <span>0 kWh (Net Zero/Solar)</span>
          <span>400 kWh</span>
          <span>800+ kWh (Large Household)</span>
        </div>
      </div>

      <div className="pt-4 border-t border-stone-100" role="group" aria-labelledby="heating-label">
        <h4 id="heating-label" className="block text-xs font-semibold text-stone-705 mb-2.5">
          How is your home primarily heated?
        </h4>
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
                aria-pressed={isSelected}
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
    </motion.fieldset>
  );
}
