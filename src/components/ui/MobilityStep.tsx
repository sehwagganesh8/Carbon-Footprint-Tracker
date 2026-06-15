import React from "react";
import { motion } from "motion/react";
import { Car } from "lucide-react";

interface MobilityStepProps {
  transportType: string;
  setTransportType: (v: string) => void;
  distance: number;
  setDistance: (v: number) => void;
}

export function MobilityStep({
  transportType,
  setTransportType,
  distance,
  setDistance
}: MobilityStepProps) {
  return (
    <motion.fieldset
      key="step-1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 block border-0 p-0 m-0"
    >
      <legend className="flex items-center gap-2.5 mb-2 w-full">
        <Car className="w-5 h-5 text-emerald-700" aria-hidden="true" />
        <h3 className="text-base font-semibold text-stone-900">1. Select Commute Vehicle</h3>
      </legend>
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
              aria-pressed={isSelected}
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
          <label htmlFor="distance-slider" className="text-xs font-semibold text-stone-700">Estimated Monthly Distance Commuted</label>
          <span className="text-sm font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100" aria-hidden="true">
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
          aria-valuemin={0}
          aria-valuemax={3500}
          aria-valuenow={distance}
        />
        <div className="flex justify-between text-[11px] text-stone-400 mt-1 font-mono" aria-hidden="true">
          <span>0 km</span>
          <span>1,500 km</span>
          <span>3,500+ km</span>
        </div>
      </div>
    </motion.fieldset>
  );
}
