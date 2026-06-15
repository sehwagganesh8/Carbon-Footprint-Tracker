import React from "react";
import { Heart } from "lucide-react";

export function AppFooter() {
  return (
    <footer id="platform-footer" className="bg-white border-t border-stone-200 py-6 mt-12 text-center text-xs text-stone-400">
      <p className="flex items-center justify-center gap-1">
        Designed with Eco-Mindfulness. Lowering footprint together.
        <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
      </p>
    </footer>
  );
}
