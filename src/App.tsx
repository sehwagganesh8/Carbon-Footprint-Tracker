"use client";
import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Leaf, BarChart3, CheckSquare, RotateCcw, Award, Globe, Heart } from "lucide-react";
import { CalculatedResults, HabitTask } from "./types";
import { HeaderNav } from "./components/layout/HeaderNav";
import { OnboardingHero } from "./components/layout/OnboardingHero";
import { DashboardHeader } from "./components/layout/DashboardHeader";
import { AppFooter } from "./components/layout/AppFooter";
import OnboardingCalculator from "./components/OnboardingCalculator";
import DashboardOverview from "./components/DashboardOverview";
import HabitTracker from "./components/HabitTracker";
import InsightsEngine from "./components/InsightsEngine";

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

  const handleOnboardingComplete = useCallback((data: CalculatedResults) => {
    setBaseline(data);
    setHasOnboarded(true);
    setGreenPoints(0);
    setSavedCo2(0);
    setCompletedTodayList([]);
  }, []);

  const handleToggleHabit = useCallback((habitId: string, isChecking: boolean, co2Saved: number, points: number) => {
    setCompletedTodayList(prevList => {
      if (isChecking && !prevList.includes(habitId)) return [...prevList, habitId];
      if (!isChecking && prevList.includes(habitId)) return prevList.filter(id => id !== habitId);
      return prevList;
    });

    if (isChecking) {
      setGreenPoints(prev => prev + points);
      setSavedCo2(prev => Math.round((prev + co2Saved) * 10) / 10);
    } else {
      setGreenPoints(prev => Math.max(0, prev - points));
      setSavedCo2(prev => Math.max(0, Math.round((prev - co2Saved) * 10) / 10));
    }
  }, []);

  const handleAddCustomHabit = useCallback((newHabit: HabitTask) => {
    setCustomHabits(prev => [newHabit, ...prev]);
  }, []);

  const handleRemoveCustomHabit = useCallback((id: string) => {
    setCompletedTodayList(prev => {
      if (prev.includes(id)) {
        setCustomHabits(tasks => {
          const deletedTask = tasks.find((t) => t.id === id);
          if (deletedTask) {
            setGreenPoints(p => Math.max(0, p - deletedTask.points));
            setSavedCo2(c => Math.max(0, Math.round((c - deletedTask.co2Savings) * 10) / 10));
          }
          return tasks;
        });
        return prev.filter(item => item !== id);
      }
      return prev;
    });
    setCustomHabits(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleResetBaseline = useCallback(() => {
    if (window.confirm("Are you sure you want to discard your carbon profile? This will reset all your tracked points and custom habits.")) {
      setBaseline(null);
      setHasOnboarded(false);
      setGreenPoints(0);
      setSavedCo2(0);
      setCompletedTodayList([]);
      setCustomHabits([]);
      setActiveTab("dashboard");
    }
  }, []);

  const allHabits = useMemo(() => [...STATIC_HABITS, ...customHabits], [customHabits]);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans transition-all">
      
      {/* Platform Navigation Header */}
      <HeaderNav
        hasOnboarded={hasOnboarded}
        baseline={baseline}
        greenPoints={greenPoints}
        savedCo2={savedCo2}
        handleResetBaseline={handleResetBaseline}
      />

      {/* Primary Main Content View container */}
      <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-start">
        
        <AnimatePresence mode="wait">
          {!hasOnboarded || !baseline ? (
            
            /* Onboarding Hero Space */
            <OnboardingHero 
              handleOnboardingComplete={handleOnboardingComplete} 
              OnboardingCalculator={OnboardingCalculator} 
            />

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
              <DashboardHeader
                baseline={baseline}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

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
      <AppFooter />
    </div>
  );
}
