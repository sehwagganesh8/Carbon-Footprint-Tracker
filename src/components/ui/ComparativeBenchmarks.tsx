import React from "react";
import { Globe, Info } from "lucide-react";

interface ComparativeBenchmarksProps {
  currentEmissions: number;
  globalAverage: number;
  usAverage: number;
  targetFristStep: number;
  usComparison: number;
}

export function ComparativeBenchmarks({
  currentEmissions,
  globalAverage,
  usAverage,
  targetFristStep,
  usComparison
}: ComparativeBenchmarksProps) {
  return (
    <div id="comparative-benchmarks" className="space-y-4 pt-4" aria-labelledby="benchmarks-label">
      <div className="flex items-center justify-between text-xs font-medium text-stone-700">
        <span id="benchmarks-label" className="flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-stone-500" aria-hidden="true" />
          Comparative Benchmarks (kg CO2 per month)
        </span>
      </div>

      <div className="relative pt-2 pb-6" aria-hidden="true">
        {/* Horizontal Track bar */}
        <div className="absolute top-2.5 left-0 right-0 h-2 bg-stone-200 rounded-full" />

        {/* Benchmark point lines */}
        <div className="absolute top-1.5 h-4 w-1 bg-emerald-700 rounded" style={{ left: `${(targetFristStep / usAverage) * 100}%` }} />
        <div className="absolute top-1.5 h-4 w-1 bg-sky-600 rounded" style={{ left: `${(globalAverage / usAverage) * 100}%` }} />
        <span className="absolute top-1.5 h-4 w-1 bg-red-600 rounded" style={{ left: `95%` }} />

        {/* Real-time slider pinpoint for active footprint */}
        <div 
          className="absolute top-0 w-5 h-5 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center transition-all duration-500 ease-out"
          style={{ left: `calc(${Math.min(100, (currentEmissions / usAverage) * 100)}% - 10px)` }}
        >
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
        </div>

        {/* Labels below map */}
        <div className="absolute top-6 left-0 right-0 flex justify-between text-[10px] text-stone-400 font-mono">
          <span className="text-emerald-700 flex flex-col items-start font-semibold">
            <span>0 kg</span>
            <span>Ideal limit</span>
          </span>
          <span className="flex flex-col items-center">
            <span>{globalAverage} kg</span>
            <span>Global Avg</span>
          </span>
          <span className="flex flex-col items-end text-rose-700 font-semibold">
            <span>{usAverage}+ kg</span>
            <span>US Avg</span>
          </span>
        </div>
      </div>

      <p className="text-xs text-stone-500 mt-2 leading-relaxed pt-3 flex items-start gap-1.5 bg-stone-50 p-2.5 rounded-lg border border-stone-200/50">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          Your current profile outputs <strong aria-label={`${usComparison} percent`}>{usComparison}%</strong> of the average US citizen's baseline footprint. 
          {currentEmissions <= globalAverage ? " Excellent job! You are below the sustainable threshold." : " Leverage the tracker habits to step closer to the sustainable target limit of 180 kg CO2/mo."}
        </span>
      </p>
    </div>
  );
}
