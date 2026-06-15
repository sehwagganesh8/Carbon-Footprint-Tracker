import React, { memo } from "react";
import { Check, Trash2, Bike, Salad, Flame } from "lucide-react";
import { HabitTask } from "../../types";

interface HabitListItemProps {
  item: HabitTask;
  isChecked: boolean;
  onToggleHabit: (habitId: string, isChecking: boolean, co2Saved: number, points: number) => void;
  onRemoveCustomHabit?: (id: string) => void;
}

const categoryIcons = {
  Transportation: Bike,
  Diet: Salad,
  "Home Energy": Flame
};

function HabitListItemComponent({
  item,
  isChecked,
  onToggleHabit,
  onRemoveCustomHabit
}: HabitListItemProps) {
  const IconComp = categoryIcons[item.category] || Bike;

  return (
    <div
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
          <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
            +{item.points} pt
          </span>
        </div>

        {item.id.startsWith("custom_") && onRemoveCustomHabit && (
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
}

export const HabitListItem = memo(HabitListItemComponent);
