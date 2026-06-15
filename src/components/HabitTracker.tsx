import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Plus, Trash2, Award, Zap, Shield, Sparkles, Bike, Salad, Flame } from "lucide-react";
import { HabitTask } from "../types";

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
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"Transportation" | "Diet" | "Home Energy">("Transportation");
  const [newSavings, setNewSavings] = useState(2.5); // Default estimated kg savings

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const pointsValue = Math.min(50, Math.max(5, Math.ceil(newSavings * 5))); // points scaled by CO2 offset
    const newTask: HabitTask = {
      id: "custom_" + Date.now().toString(),
      title: newTitle.trim(),
      category: newCategory,
      co2Savings: Math.round(newSavings * 10) / 10,
      points: pointsValue,
      completedToday: false,
      frequency: "daily"
    };

    onAddCustomHabit(newTask);
    setNewTitle("");
    setNewSavings(2.5);
    setShowAddForm(false);
  };

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
          <header className="flex justify-between items-center mb-4">
            <div>
              <h3 id="tracker-title" className="text-base font-bold text-stone-800">Daily Green Habits</h3>
              <p className="text-xs text-stone-400">Complete tasks to deduct live weight from your baseline carbon footprint.</p>
            </div>

            <button
              id="add-custom-habit-trigger"
              onClick={() => setShowAddForm(!showAddForm)}
              aria-expanded={showAddForm}
              aria-controls="custom-habit-form"
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              Custom Habit
            </button>
          </header>

          {/* Add custom habit slider form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.form
                id="custom-habit-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleFormSubmit}
                className="bg-stone-50 border border-stone-200 p-4 rounded-xl mb-4 space-y-3 overflow-hidden"
              >
                <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-0 p-0 m-0">
                  <legend className="sr-only">New Custom Habit Details</legend>
                  <div>
                    <label htmlFor="input-custom-title" className="block text-[11px] font-bold text-stone-600 mb-1">Habit Title</label>
                    <input
                      id="input-custom-title"
                      type="text"
                      required
                      placeholder="e.g. Unplugged chargers"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-1.5 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-stone-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="select-custom-category" className="block text-[11px] font-bold text-stone-600 mb-1">Impact Category</label>
                    <select
                      id="select-custom-category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-stone-800"
                    >
                      <option value="Transportation">Transportation 🚗</option>
                      <option value="Diet">Diet 🥗</option>
                      <option value="Home Energy">Home Energy ⚡</option>
                    </select>
                  </div>
                </fieldset>

                <div className="flex items-center justify-between pt-1 gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-[11px] text-stone-600 mb-1 flex-wrap">
                      <label htmlFor="input-custom-savings" className="mr-2">Co2 Offsite impact:</label>
                      <strong className="text-emerald-700" aria-live="polite">{newSavings} kg Saved</strong>
                    </div>
                    <input
                      id="input-custom-savings"
                      type="range"
                      min="0.5"
                      max="12"
                      step="0.5"
                      value={newSavings}
                      onChange={(e) => setNewSavings(parseFloat(e.target.value))}
                      className="w-full accent-emerald-700 block mt-1"
                    />
                  </div>
                  <button
                    id="submit-new-habit"
                    type="submit"
                    className="self-end px-4 py-2 text-xs font-bold text-stone-50 bg-emerald-800 rounded-lg hover:bg-emerald-750 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-1"
                  >
                    Add Habit
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* List layout */}
          <div id="habits-list-scroll-grid" className="space-y-2 max-h-[360px] overflow-y-auto pr-1" role="list">
            {customAndStaticHabits.map((item) => {
              const isChecked = completedTodayList.includes(item.id);
              const IconComp = categoryIcons[item.category] || Bike;

              return (
                <div
                  key={item.id}
                  id={`habit-card-${item.id}`}
                  role="listitem"
                  className={`p-3 border rounded-xl flex items-center justify-between transition-all duration-150 ${
                    isChecked
                      ? "bg-emerald-50/50 border-emerald-300 text-stone-800"
                      : "bg-white border-stone-200 text-stone-700 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      id={`check-habit-btn-${item.id}`}
                      role="checkbox"
                      aria-checked={isChecked}
                      aria-labelledby={`habit-label-${item.id}`}
                      onClick={() => onToggleHabit(item.id, !isChecked, item.co2Savings, item.points)}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          onToggleHabit(item.id, !isChecked, item.co2Savings, item.points);
                        }
                      }}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        isChecked
                          ? "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700"
                          : "border-stone-300 bg-stone-50 text-transparent hover:border-emerald-600"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>

                    <div 
                      className="text-left flex-1 cursor-pointer" 
                      onClick={() => onToggleHabit(item.id, !isChecked, item.co2Savings, item.points)}
                      aria-hidden="true"
                    >
                      <div className="flex items-center gap-1.5">
                        <IconComp className={`w-3.5 h-3.5 ${isChecked ? "text-emerald-700" : "text-stone-400"}`} aria-hidden="true" />
                        <span id={`habit-label-${item.id}`} className={`text-xs font-semibold ${isChecked ? "line-through text-stone-500 font-medium" : "text-stone-800"}`}>
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-400 font-mono mt-0.5">
                        Category: <span className="font-semibold">{item.category}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono" aria-label={`Saves ${item.co2Savings} kg CO2 and gives ${item.points} points`}>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mr-1">
                        -{item.co2Savings} kg
                      </span>
                      <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded">
                        +{item.points} pts
                      </span>
                    </div>

                    {/* Delete Custom button strictly for custom prefix IDs */}
                    {item.id.startsWith("custom_") && (
                      <button
                        id={`delete-habit-btn-${item.id}`}
                        onClick={() => onRemoveCustomHabit(item.id)}
                        aria-label={`Delete custom habit ${item.title}`}
                        className="p-1.5 text-stone-300 hover:text-rose-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500 rounded"
                        title="Remove custom task"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
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
