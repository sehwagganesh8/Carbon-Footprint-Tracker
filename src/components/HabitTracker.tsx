import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Plus, Trash2, Award, Zap, Shield, Sparkles, Bike, Salad, Flame } from "lucide-react";
import { HabitTask } from "../types";
import { HabitListItem } from "./ui/HabitListItem";
import { HabitAddForm } from "./ui/HabitAddForm";

interface HabitTrackerProps {
  completedTodayList: string[]; // List of completed habit IDs
  onToggleHabit: (habitId: string, isChecking: boolean, co2Saved: number, points: number) => void;
  onAddCustomHabit: (newHabit: HabitTask) => void;
  onRemoveCustomHabit: (id: string) => void;
  customAndStaticHabits: HabitTask[];
  greenPoints: number;
}

export default function HabitTracker({
  completedTodayList,
  onToggleHabit,
  onAddCustomHabit,
  onRemoveCustomHabit,
  customAndStaticHabits,
  greenPoints
}: HabitTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  // Map levels based on Cumulative Green Points
  const getBadgeRank = (points: number) => {
    if (points >= 500) return { title: "Earth Sentinel 🌍", desc: "Eco Vanguard Tier", color: "from-purple-700 to-indigo-800 text-purple-100", icon: Sparkles };
    if (points >= 300) return { title: "Forest Guardian 🌳", desc: "Eco Champion Tier", color: "from-emerald-700 to-teal-800 text-teal-100", icon: Award };
    if (points >= 150) return { title: "Green Activist 🌿", desc: "Eco Pioneer Tier", color: "from-amber-600 to-yellow-700 text-amber-50", icon: Zap };
    return { title: "Seed Scout 🌱", desc: "Baseline Level 1 Tracker", color: "from-stone-500 to-stone-600 text-stone-50", icon: Shield };
  };

  const badge = getBadgeRank(greenPoints);
  const BadgeIcon = badge.icon;

  // Next evaluation points threshold percentage
  const getNextLevelPercentage = (points: number) => {
    if (points >= 500) return 100;
    if (points >= 300) return Math.round(((points - 300) / 200) * 100);
    if (points >= 150) return Math.round(((points - 150) / 150) * 100);
    return Math.round((points / 150) * 100);
  };

  const levelProgress = getNextLevelPercentage(greenPoints);
  const nextTarget = greenPoints >= 500 ? "Max Level" : greenPoints >= 300 ? "500 pts" : greenPoints >= 150 ? "300 pts" : "150 pts";

  const categoryIcons = {
    Transportation: Bike,
    Diet: Salad,
    "Home Energy": Flame
  };

  return (
    <section id="habit-tracker-container" aria-labelledby="tracker-title" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Sidebar: Green Rank badges */}
      <aside id="gamified-rank-hud" aria-labelledby="rank-title" className="bg-white rounded-2xl border border-stone-200 p-6 shadow-md flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Green Points Engine
          </span>
          <h3 id="rank-title" className="text-xl font-bold font-serif text-stone-900 mt-2 mb-4">Your Sustainability Rank</h3>
          
          <div className={`p-5 rounded-2xl bg-gradient-to-br ${badge.color} shadow-lg relative overflow-hidden flex flex-col items-center justify-center text-center my-4`} aria-live="polite">
            {/* Decal Background Rings */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/5 border border-white/10" aria-hidden="true" />
            
            <BadgeIcon className="w-12 h-12 mb-3 drop-shadow" aria-hidden="true" />
            <h4 className="text-base font-black tracking-tight">{badge.title}</h4>
            <p className="text-[11px] opacity-85 mt-0.5">{badge.desc}</p>

            <span className="mt-4 font-mono font-bold text-xl px-4 py-1.5 rounded-full bg-black/20" aria-label={`Current points: ${greenPoints}`}>
              {greenPoints} <span className="text-xs opacity-75" aria-hidden="true">pts</span>
            </span>
          </div>
        </div>

        {/* Dynamic Progression bar */}
        <div className="space-y-2 mt-4 pt-4 border-t border-stone-100">
          <div className="flex justify-between text-xs font-semibold text-stone-700">
            <span>Next Privilege Tier</span>
            <span>{nextTarget}</span>
          </div>
          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200/50" role="progressbar" aria-valuenow={levelProgress} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to next tier">
            <div 
              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          <p className="text-[10px] text-stone-400 font-mono text-right" aria-hidden="true">
            {levelProgress}% complete towards next badge upgrade
          </p>
        </div>
      </aside>

      {/* Main Habit Check Cards */}
      <section id="habits-check-list-card" className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 shadow-md flex flex-col justify-between">
        
        <div>
          <HabitAddForm
            onAddCustomHabit={onAddCustomHabit}
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
          />

          {/* List layout */}
          <div id="habits-list-scroll-grid" className="space-y-2 max-h-[360px] overflow-y-auto pr-1" role="list">
            {customAndStaticHabits.map((item) => (
              <HabitListItem
                key={item.id}
                item={item}
                isChecked={completedTodayList.includes(item.id)}
                onToggleHabit={onToggleHabit}
                onRemoveCustomHabit={onRemoveCustomHabit}
              />
            ))}
          </div>
        </div>

        {completedTodayList.length > 0 && (
          <div className="text-center py-2.5 mt-4 bg-emerald-50/50 border border-emerald-100 rounded-xl" role="status" aria-live="polite">
            <p className="text-xs text-emerald-800 font-medium flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-bounce" aria-hidden="true" />
              Superb! You checked off {completedTodayList.length} sustainable practices today.
            </p>
          </div>
        )}

      </section>

    </section>
  );
}
