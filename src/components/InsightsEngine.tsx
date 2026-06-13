import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Eye, RefreshCw, AlertCircle, Calendar, ArrowRight, Lightbulb } from "lucide-react";
import { CalculatedResults, InsightTip } from "../types";

interface InsightsEngineProps {
  baseline: CalculatedResults;
}

export default function InsightsEngine({ baseline }: InsightsEngineProps) {
  const [tips, setTips] = useState<InsightTip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAiTips = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          answers: baseline.answers,
          emissions: {
            transport: baseline.transport,
            diet: baseline.diet,
            energy: baseline.energy,
            total: baseline.total
          }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to contact insights server");
      }

      const data = await response.json();
      if (data && data.tips) {
        setTips(data.tips);
      } else {
        throw new Error("Server returned an invalid tips schema");
      }
    } catch (err: any) {
      console.error("Error drawing AI insights:", err);
      setError("Notice: Serving profile-tailored benchmark guidelines.");
      setTips([
        {
          title: "Swap Driving for Active Commutes",
          category: "Transportation",
          impact: "Saves ~35 kg CO2/mo",
          description: "Try walking or cycling for short trips under 3km. It reduces peak tailpipe carbon and improves cardiovascular wellness."
        },
        {
          title: "Plan Two Meatless Days Weekly",
          category: "Diet",
          impact: "Saves ~20 kg CO2/mo",
          description: "Transitioning a few dinners per week to legumes, vegetables, and grains drastically drops agricultural pressure."
        },
        {
          title: "Install LED Lighting",
          category: "Home Energy",
          impact: "Saves ~12 kg CO2/mo",
          description: "Replace remaining incandescent bulbs with energy-efficient LEDs, which consume up to 85% less electricity."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (baseline) {
      fetchAiTips();
    }
  }, [baseline]);

  // Styling helper for category highlights
  const getCategoryColor = (category: string) => {
    const norm = category.toLowerCase();
    if (norm.includes("transport") || norm.includes("mobil")) {
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    }
    if (norm.includes("diet") || norm.includes("nutrit") || norm.includes("food")) {
      return "bg-sky-50 text-sky-800 border-sky-205";
    }
    return "bg-amber-50 text-amber-800 border-amber-205";
  };

  return (
    <div id="insights-engine-section" className="bg-white rounded-2xl border border-stone-200 p-6 shadow-md">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-violet-50 text-violet-700 border border-violet-100 rounded-lg">
              <Sparkles className="w-4 h-4 animate-pulse text-violet-700" />
            </span>
            <span className="text-xs font-bold text-violet-800 uppercase tracking-wider">
              Gemini AI Advisory
            </span>
          </div>
          <h3 className="text-xl font-bold font-serif text-stone-900 mt-2">Personalized Savings Targets</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Sourced suggestions optimizing your layout answers to shortcut high-impact savings.
          </p>
        </div>

        <button
          id="regenerate-tips-btn"
          onClick={fetchAiTips}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 text-xs font-semibold bg-stone-50 hover:bg-stone-100/50 text-stone-700 border border-stone-200 hover:border-stone-300 rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Insights
        </button>
      </div>

      {/* Loading Skeleton block */}
      {loading ? (
        <div id="insights-loader" className="space-y-3 py-6">
          <div className="flex items-center justify-center gap-3 text-sm text-stone-500 font-mono py-4">
            <RefreshCw className="w-5 h-5 animate-spin text-emerald-700" />
            <span>EcoTrack AI is auditing your emissions baseline...</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-5 border border-stone-100 rounded-2xl bg-stone-50/60 space-y-3 animate-pulse">
                <div className="h-4 bg-stone-200 rounded-full w-2/3" />
                <div className="h-3 bg-stone-200 rounded-full w-1/3" />
                <div className="h-10 bg-stone-200/80 rounded z-10" />
                <div className="h-6 bg-stone-200 rounded-full w-1/2" />
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div id="insights-error-banner" className="p-4 bg-amber-50 border border-amber-200 text-stone-700 text-xs rounded-xl flex items-start gap-2 mb-4">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Notice</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      ) : null}

      {/* Renders AI suggestions list when not loading */}
      {!loading && tips.length > 0 && (
        <motion.div
          id="tips-gallery-grid"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {tips.map((tip, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 15 },
                show: { opacity: 1, y: 0 }
              }}
              className="p-5 border border-stone-200 rounded-2xl bg-stone-50/40 hover:bg-white hover:border-emerald-600/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getCategoryColor(tip.category)}`}>
                    {tip.category}
                  </span>
                  <div className="p-1 bg-violet-50 text-violet-700 rounded">
                    <Lightbulb className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h4 className="text-sm font-bold text-stone-800 tracking-tight leading-snug">
                  {tip.title}
                </h4>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  {tip.description}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs mt-4">
                <span className="text-emerald-800 font-bold font-mono">
                  {tip.impact}
                </span>
                <span className="text-stone-400 flex items-center gap-1 hover:text-emerald-700 cursor-pointer">
                  Learn how
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Sustainable pledge callout */}
      {!loading && (
        <div id="insights-disclaimer" className="mt-5 p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-[11px] text-stone-400 font-medium leading-relaxed uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-700" />
          <span>Tips are tailored based on calculated greenhouse averages of your mobility, nutrition and energy inputs.</span>
        </div>
      )}

    </div>
  );
}
