import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { ShieldCheck, TrendingDown, Landmark } from "lucide-react";
import { CalculatedResults } from "../types";
import { ComparativeBenchmarks } from "./ui/ComparativeBenchmarks";

interface DashboardOverviewProps {
  baseline: CalculatedResults;
  savedCo2: number; // accumulated kg CO2 saved from habits
}

export default function DashboardOverview({ baseline, savedCo2 }: DashboardOverviewProps) {
  // Compute modified monthly footprint resulting from active habits checked
  const currentEmissions = Math.max(0, baseline.total - savedCo2);

  // Recharts Pie Data
  const chartData = [
    { name: "Mobility", value: baseline.transport, color: "#065f46" }, // Emerald 800
    { name: "Nutrition", value: baseline.diet, color: "#0284c7" },    // Sky 600
    { name: "Home Energy", value: baseline.energy, color: "#d97706" } // Amber 600
  ].filter(item => item.value > 0);

  // Comparison figures (converted to monthly kg CO2)
  const usAverage = 1330;      // US monthly average footprint as benchmark
  const globalAverage = 400;   // Global average footprint
  const targetFristStep = 180; // Sustainable benchmark goal

  // Calculate percentages
  const savingsPct = Math.round((savedCo2 / baseline.total) * 100) || 0;
  const usComparison = Math.round((currentEmissions / usAverage) * 100);

  return (
    <div id="dashboard-overview-layout" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Primary Highlights Section */}
      <section id="carbon-summary-card" aria-labelledby="metrics-title" className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 shadow-md flex flex-col justify-between">
        <header className="flex justify-between items-start mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Carbon footprint
            </span>
            <h3 id="metrics-title" className="text-xl font-bold font-serif text-stone-900 mt-2">Emission Metrics</h3>
          </div>
          <div className="text-right">
            <p className="text-xs text-stone-400">Status</p>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
              currentEmissions < globalAverage 
                ? "bg-emerald-100 text-emerald-800" 
                : currentEmissions < usAverage 
                ? "bg-amber-100 text-amber-800" 
                : "bg-rose-100 text-rose-800"
            }`}>
              {currentEmissions < globalAverage ? "Sustainable-Leader" : currentEmissions < usAverage ? "Moderate" : "High Intensity"}
            </span>
          </div>
        </header>

        {/* Big Numbers Display */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 my-2 border-y border-stone-100" role="region" aria-label="Quick statistics">
          <div id="stat-baseline" className="p-4 bg-stone-50 rounded-xl border border-stone-200/60">
            <p className="text-xs text-stone-500 font-medium">Initial Baseline</p>
            <p className="text-2xl font-black text-stone-800 font-mono mt-1">
              {baseline.total} <span className="text-xs font-normal text-stone-500">kg/mo</span>
            </p>
          </div>
          <div id="stat-savings" className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex flex-col justify-between">
            <div>
              <p className="text-xs text-emerald-800 font-medium flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
                Active Savings
              </p>
              <p className="text-2xl font-black text-emerald-900 font-mono mt-1">
                -{savedCo2} <span className="text-xs font-normal text-emerald-700">kg/mo</span>
              </p>
            </div>
            {savingsPct > 0 && (
              <span className="text-[10px] text-emerald-700 font-bold mt-1">
                Reduced footprint by {savingsPct}%
              </span>
            )}
          </div>
          <div id="stat-current" className="p-4 bg-stone-900 rounded-xl border border-stone-950 text-stone-50">
            <p className="text-xs text-stone-400 font-medium">Net Real Footprint</p>
            <p className="text-2xl font-black text-emerald-400 font-mono mt-1">
              {currentEmissions} <span className="text-xs font-normal text-stone-400">kg/mo</span>
            </p>
          </div>
        </div>

        {/* Dynamic Global Comparison slider chart */}
        <ComparativeBenchmarks
          currentEmissions={currentEmissions}
          globalAverage={globalAverage}
          usAverage={usAverage}
          targetFristStep={targetFristStep}
          usComparison={usComparison}
        />
      </section>

      {/* Pie Chart Section */}
      <section id="categories-chart-card" aria-labelledby="breakdown-title" className="bg-white rounded-2xl border border-stone-200 p-6 shadow-md flex flex-col justify-between">
        <header>
          <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Contribution
          </span>
          <h3 id="breakdown-title" className="text-xl font-bold font-serif text-stone-900 mt-2 mb-3">Emission Breakdown</h3>
          <p className="text-xs text-stone-500">
            Visual breakdown of your monthly carbon output by category based on your baseline.
          </p>
        </header>

        {/* Chart rendering container */}
        <div className="h-44 my-4 flex items-center justify-center" aria-hidden="true">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} kg CO2`, "Impact"]}
                  contentStyle={{ background: "#f5f5f4", border: "1px solid #d6d3d1", borderRadius: "8px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-stone-400 text-xs flex flex-col items-center gap-1.5">
              <ShieldCheck className="w-10 h-10 text-stone-300" />
              <span>No carbon data registered</span>
            </div>
          )}
        </div>

        {/* Customized Legend Grid */}
        <div className="space-y-2 border-t border-stone-100 pt-4" aria-label="Breakdown values">
          {chartData.map((item, index) => {
            const percentage = Math.round((item.value / baseline.total) * 100);
            return (
              <div key={index} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
                  <span className="text-stone-700 font-medium">{item.name}</span>
                </div>
                <div className="text-right font-mono font-bold text-stone-800 flex gap-2">
                  <span>{item.value} kg</span>
                  <span className="text-stone-400 font-normal">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
