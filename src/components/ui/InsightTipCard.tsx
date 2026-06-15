import React from "react";
import { motion } from "motion/react";
import { Lightbulb, ArrowRight } from "lucide-react";
import { InsightTip } from "../../types";

interface InsightTipCardProps {
  tip: InsightTip;
  getCategoryColor: (category: string) => string;
}

export const InsightTipCard: React.FC<InsightTipCardProps> = ({ tip, getCategoryColor }) => {
  return (
    <motion.li
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
          <div className="p-1 bg-violet-50 text-violet-700 rounded" aria-hidden="true">
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
        <span className="text-emerald-800 font-bold font-mono" aria-label={`Estimated impact: ${tip.impact}`}>
          {tip.impact}
        </span>
        <span className="text-stone-400 flex items-center gap-1 hover:text-emerald-700 cursor-pointer" role="button" tabIndex={0} aria-label="Learn how">
          Learn how
          <ArrowRight className="w-3 h-3" aria-hidden="true" />
        </span>
      </div>
    </motion.li>
  );
}
