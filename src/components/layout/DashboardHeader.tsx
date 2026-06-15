import React from "react";
import { BarChart3, CheckSquare } from "lucide-react";
import { CalculatedResults } from "../../types";

interface DashboardHeaderProps {
  baseline: CalculatedResults;
  activeTab: "dashboard" | "habits";
  setActiveTab: (tab: "dashboard" | "habits") => void;
}

export function DashboardHeader({ baseline, activeTab, setActiveTab }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-200 pb-5">
      <div>
        <h2 className="text-2xl font-black text-stone-900 font-serif tracking-tight">
          Welcome to EcoTrack
        </h2>
        <p className="text-xs text-stone-500">
          Calculated baseline: <strong className="font-semibold text-stone-700">{baseline.total} kg CO2/month</strong>. Turn habits green to offset your output.
        </p>
      </div>

      {/* Segmented controls styling */}
      <nav id="navigation-tabs" role="tablist" aria-label="Dashboard views" className="flex items-center gap-2 p-1.5 bg-stone-200/60 rounded-xl border border-stone-300/30">
        <button
          id="tab-btn-dashboard"
          role="tab"
          aria-selected={activeTab === "dashboard"}
          aria-controls="panel-dashboard"
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "dashboard"
              ? "bg-white text-stone-900 shadow"
              : "text-stone-500 hover:text-stone-700"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
          Insights Dashboard
        </button>

        <button
          id="tab-btn-habits"
          role="tab"
          aria-selected={activeTab === "habits"}
          aria-controls="panel-habits"
          onClick={() => setActiveTab("habits")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "habits"
              ? "bg-white text-stone-950 shadow"
              : "text-stone-500 hover:text-stone-700"
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" aria-hidden="true" />
          Action Habit Tracker
        </button>
      </nav>
    </header>
  );
}
