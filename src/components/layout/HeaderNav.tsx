"use client";
import React from "react";
import { Leaf, RotateCcw, Award } from "lucide-react";
import { CalculatedResults } from "../../types";

interface HeaderNavProps {
  hasOnboarded: boolean;
  baseline: CalculatedResults | null;
  greenPoints: number;
  savedCo2: number;
  handleResetBaseline: () => void;
}

export function HeaderNav({
  hasOnboarded,
  baseline,
  greenPoints,
  savedCo2,
  handleResetBaseline
}: HeaderNavProps) {
  return (
    <header id="main-navigation-header" className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between min-h-[4.5rem]">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-emerald-600 text-stone-100 rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-stone-100 fill-stone-100" />
          </span>
          <div>
            <h1 className="text-lg font-black text-stone-900 tracking-tight font-serif uppercase flex items-center gap-1.5 select-none font-serif">
              EcoTrack
            </h1>
            <p className="text-[10px] text-stone-400 font-medium">Living lightly, step by step</p>
          </div>
        </div>

        {hasOnboarded && baseline && (
          <div id="quick-hud-metrics" className="flex items-center gap-4">
            <div className="hidden sm:flex text-right flex-col">
              <span className="text-[10px] text-stone-400 block font-medium">Green Points Balance</span>
              <span className="text-sm font-bold font-mono text-amber-700 tracking-tight flex items-center gap-1 justify-end">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                {greenPoints} pts
              </span>
            </div>
            <div className="hidden sm:block h-8 w-px bg-stone-200" />
            <div className="hidden sm:flex text-right flex-col">
              <span className="text-[10px] text-stone-400 block font-medium">Monthly Offset</span>
              <span className="text-sm font-bold font-mono text-emerald-800">
                -{savedCo2} kg CO2
              </span>
            </div>
            <div className="hidden sm:block h-8 w-px bg-stone-200" />
            <button
              id="header-reset-btn"
              onClick={handleResetBaseline}
              className="px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Reset calculator and start over"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              Reset App
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
