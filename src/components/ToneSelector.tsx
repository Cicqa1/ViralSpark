import React, { useState } from "react";
import { TONE_PRESETS } from "../data";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface ToneSelectorProps {
  selectedTone: string;
  onChange: (tone: string) => void;
  theme?: "dark" | "light";
}

export default function ToneSelector({ selectedTone, onChange, theme = "dark" }: ToneSelectorProps) {
  const [customTone, setCustomTone] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);

  const handleSelectPreset = (value: string) => {
    setIsCustomMode(false);
    onChange(value);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTone(e.target.value);
    onChange(e.target.value);
  };

  const enableCustomMode = () => {
    setIsCustomMode(true);
    onChange(customTone || "Friendly & Personal");
  };

  const isDark = theme === "dark";

  return (
    <div id="tone-selector" className="space-y-3">
      <div className="flex items-center justify-between">
        <label className={`text-xs font-bold uppercase tracking-wider font-display flex items-center gap-1.5 transition-colors duration-500 ease-in-out ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          <Sparkles size={14} className={`transition-colors duration-500 ease-in-out ${isDark ? "text-violet-400" : "text-blue-500"}`} />
          <span>Copywriting Tone</span>
        </label>
        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-medium border transition-all duration-500 ease-in-out ${
          isDark 
            ? "text-violet-400 bg-violet-950/40 border-violet-800/40" 
            : "text-blue-600 bg-blue-50 border-blue-100"
        }`}>
          {selectedTone || "Not Selected"}
        </span>
      </div>

      {/* Grid of presets */}
      <div className="grid grid-cols-2 gap-2">
        {TONE_PRESETS.map((p, idx) => {
          const isSelected = !isCustomMode && selectedTone === p.value;
          return (
            <motion.button
              key={p.value}
              type="button"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => handleSelectPreset(p.value)}
              className={`text-left p-3 rounded-xl border text-xs transition-all duration-500 ease-in-out cursor-pointer ${
                isSelected
                  ? isDark
                    ? "border-violet-500 bg-violet-950/40 text-violet-100 ring-2 ring-violet-500/20"
                    : "border-blue-500 bg-blue-50/50 text-blue-900 ring-2 ring-blue-500/20"
                  : isDark
                    ? "border-slate-800/80 hover:border-slate-700 bg-slate-900/40 text-slate-300"
                    : "border-slate-200 hover:border-slate-350 bg-white text-slate-700"
              }`}
            >
              <div className={`font-semibold transition-colors duration-500 ease-in-out ${isDark ? "text-slate-100" : "text-slate-800"}`}>{p.label}</div>
              <div className={`text-[10px] mt-1 leading-normal line-clamp-2 transition-colors duration-500 ease-in-out ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {p.desc}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Custom tone field */}
      <div className="pt-1">
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={enableCustomMode}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-500 ease-in-out ${
              isCustomMode
                ? isDark
                  ? "border-violet-500 bg-violet-950 text-violet-300 font-semibold"
                  : "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                : isDark
                  ? "border-slate-800/80 hover:border-slate-700 bg-slate-900/40 text-slate-400"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-600"
            }`}
          >
            Custom Tone...
          </motion.button>
          {isCustomMode && (
            <motion.input
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              type="text"
              value={customTone}
              onChange={handleCustomChange}
              placeholder="e.g. Witty, Academic, Brutally Honest..."
              className={`flex-1 px-3 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 font-sans transition-all duration-500 ease-in-out ${
                isDark
                  ? "bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:ring-violet-500/20 focus:border-violet-500"
                  : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-blue-500/20 focus:border-blue-500"
              }`}
              maxLength={40}
            />
          )}
        </div>
      </div>
    </div>
  );
}

