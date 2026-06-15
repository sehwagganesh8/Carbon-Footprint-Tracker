"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { HabitTask } from "../../types";

interface HabitAddFormProps {
  onAddCustomHabit: (newHabit: HabitTask) => void;
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
}

export function HabitAddForm({
  onAddCustomHabit,
  showAddForm,
  setShowAddForm
}: HabitAddFormProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"Transportation" | "Diet" | "Home Energy">("Transportation");
  const [newSavings, setNewSavings] = useState(2.5);

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

  return (
    <>
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
                  onChange={(e) => setNewCategory(e.target.value as HabitTask["category"])}
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
    </>
  );
}
