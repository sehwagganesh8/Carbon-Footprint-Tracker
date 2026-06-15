import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Leaf, BarChart3, CheckSquare, RotateCcw, Award, Globe, Heart } from "lucide-react";
import OnboardingCalculator from "./components/OnboardingCalculator";
import DashboardOverview from "./components/DashboardOverview";
import HabitTracker from "./components/HabitTracker";
import InsightsEngine from "./components/InsightsEngine";
import { CalculatedResults, HabitTask } from "./types";

const STATIC_HABITS: HabitTask[] = [
  { id: "habit_1", title: "Eat all plant-based meals today", category: "Diet", co2Savings: 6.5, points: 25, completedToday: false, frequency: "daily" },
  { id: "habit_2", title: "Commute via public transit or train", category: "Transportation", co2Savings: 8.0, points: 30, completedToday: false, frequency: "daily" },
  { id: "habit_3", title: "Air-dry laundry instead of heating drier", category: "Home Energy", co2Savings: 2.2, points: 15, completedToday: false, frequency: "daily" },
  { id: "habit_4", title: "Limit shower duration to under 5 minutes", category: "Home Energy", co2Savings: 3.0, points: 15, completedToday: false, frequency: "daily" },
  { id: "habit_5", title: "Unplug standby electronics & chargers", category: "Home Energy", co2Savings: 1.0, points: 10, completedToday: false, frequency: "daily" },
  { id: "habit_6", title: "Carpool or walk under 3km today", category: "Transportation", co2Savings: 4.8, points: 20, completedToday: false, frequency: "daily" },
  { id: "habit_7", title: "Buy local, unwrapped seasonal produce", category: "Diet", co2Savings: 1.5, points: 12, completedToday: false, frequency: "daily" }
];

export default function App() {
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);
  const [baseline, setBaseline] = useState<CalculatedResults | null>(null);
  const [greenPoints, setGreenPoints] = useState<number>(0);
  const [savedCo2, setSavedCo2] = useState<number>(0);
  const [completedTodayList, setCompletedTodayList] = useState<string[]>([]);
  const [customHabits, setCustomHabits] = useState<HabitTask[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "habits">("dashboard");

  const handleOnboardingComplete = (data: CalculatedResults) => {
    setBaseline(data);
    setHasOnboarded(true);
    setGreenPoints(0);
    setSavedCo2(0);
    setCompletedTodayList([]);
  };

  const handleToggleHabit = (habitId: string, isChecking: boolean, co2Saved: number, points: number) => {
    let newList = [...completedTodayList];
    let newPointsCount = greenPoints;
    let newSavedCo2Count = savedCo2;

    if (isChecking) {
      if (!newList.includes(habitId)) {
        newList.push(habitId);
        newPointsCount += points;
        newSavedCo2Count += co2Saved;
      }
    } else {
      newList = newList.filter((id) => id !== habitId);
      newPointsCount = Math.max(0, newPointsCount - points);
      newSavedCo2Count = Math.max(0, newSavedCo2Count - co2Saved);
    }

    setCompletedTodayList(newList);
    setGreenPoints(newPointsCount);
    // round to 1 decimal place to prevent floating point inaccuracy
    const roundedCo2 = Math.round(newSavedCo2Count * 10) / 10;
    setSavedCo2(roundedCo2);
  };

  const handleAddCustomHabit = (newHabit: HabitTask) => {
    const nextCustomList = [newHabit, ...customHabits];
    setCustomHabits(nextCustomList);
  };

  const handleRemoveCustomHabit = (id: string) => {
    let updatedCompletedTodayList = [...completedTodayList];
    let updatedPoints = greenPoints;
    let updatedSavedCo2 = savedCo2;

    // If deleted habit was completed, deduct its score first
    if (completedTodayList.includes(id)) {
      const deletedTask = customHabits.find((t) => t.id === id);
      if (deletedTask) {
        updatedCompletedTodayList = completedTodayList.filter((item) => item !== id);
        updatedPoints = Math.max(0, greenPoints - deletedTask.points);
        updatedSavedCo2 = Math.max(0, savedCo2 - deletedTask.co2Savings);
        const roundedCo2 = Math.round(updatedSavedCo2 * 10) / 10;
        updatedSavedCo2 = roundedCo2;

        setCompletedTodayList(updatedCompletedTodayList);
        setGreenPoints(updatedPoints);
        setSavedCo2(updatedSavedCo2);
      }
    }

    const nextCustomList = customHabits.filter((t) => t.id !== id);
    setCustomHabits(nextCustomList);
  };

  const handleResetBaseline = () => {
    if (window.confirm("Are you sure you want to discard your carbon profile? This will reset all your tracked points and custom habits.")) {
      setBaseline(null);
      setHasOnboarded(false);
      setGreenPoints(0);
      setSavedCo2(0);
      setCompletedTodayList([]);
      setCustomHabits([]);
      setActiveTab("dashboard");
    }
  };

  const allHabits = [...STATIC_HABITS, ...customHabits];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans transition-all">
      
      {/* Platform Navigation Header */}
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

      {/* Primary Main Content View container */}
      <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-start">
        
        <AnimatePresence mode="wait">
          {!hasOnboarded || !baseline ? (
            
            /* Onboarding Hero Space */
            <motion.section
              key="onboarding-space"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-center items-center py-6"
              aria-labelledby="onboarding-heading"
            >
              <header className="text-center max-w-xl mx-auto mb-8 space-y-4">
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-bold uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  <Globe className="w-3.5 h-3.5 text-emerald-700 animate-spin" aria-hidden="true" />
                  Eco-friendly Hackathon MVP
                </div>
                <h2 id="onboarding-heading" className="text-3xl md:text-4xl font-extrabold text-stone-900 font-serif tracking-tight">
                  Discover Your Carbon Footprint
                </h2>
                <p className="text-sm text-stone-500 leading-relaxed max-w-md mx-auto">
                  Take credit for your habits. Get immediate baseline metrics representing your diet, energy, and transportation, then log actions to lower your scores.
                </p>
              </header>

              {/* Onboarding Wizard element */}
              <OnboardingCalculator onComplete={handleOnboardingComplete} />
            </motion.section>

          ) : (
            
            /* Main Application Dashboard Panel */
            <motion.article
              key="active-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-8"
              aria-label="Dashboard Overview"
            >
              {/* Header welcome slot and tab filters */}
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

              {/* Segment slots */}
              <div id="dynamic-tab-outlet" className="space-y-8">
                {activeTab === "dashboard" && (
                  <div id="panel-dashboard" role="tabpanel" aria-labelledby="tab-btn-dashboard" tabIndex={0}>
                    {/* Visual graph and progress markers */}
                    <DashboardOverview baseline={baseline} savedCo2={savedCo2} />
                    
                    {/* Gemini AI Action Insights card */}
                    <InsightsEngine baseline={baseline} />
                  </div>
                )}

                {activeTab === "habits" && (
                  <div id="panel-habits" role="tabpanel" aria-labelledby="tab-btn-habits" tabIndex={0}>
                    <HabitTracker
                      completedTodayList={completedTodayList}
                      onToggleHabit={handleToggleHabit}
                      onAddCustomHabit={handleAddCustomHabit}
                      onRemoveCustomHabit={handleRemoveCustomHabit}
                      customAndStaticHabits={allHabits}
                      greenPoints={greenPoints}
                    />
                  </div>
                )}
              </div>

              {/* Bottom reset actions rail */}
              <div id="danger-reset-rail" className="flex justify-end pt-6 border-t border-stone-200">
                <button
                  id="reset-baseline-config"
                  onClick={handleResetBaseline}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-400 hover:text-stone-700 border border-transparent hover:border-stone-200 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer select-none"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Discard and Reset Baseline config
                </button>
              </div>
            </motion.article>
          )}
        </AnimatePresence>

      </main>

      {/* Small Humble footer with no margin clutter */}
      <footer id="platform-footer" className="bg-white border-t border-stone-200 py-6 mt-12 text-center text-xs text-stone-400">
        <p className="flex items-center justify-center gap-1">
          Designed with Eco-Mindfulness. Lowering footprint together.
          <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
        </p>
      </footer>
    </div>
  );
}
