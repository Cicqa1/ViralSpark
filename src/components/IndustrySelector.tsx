import React, { useState } from "react";
import { INDUSTRY_PRESETS } from "../data";
import { Briefcase } from "lucide-react";
import { motion } from "motion/react";

interface IndustrySelectorProps {
  selectedIndustry: string;
  onChange: (industry: string) => void;
  theme?: "dark" | "light";
}

export default function IndustrySelector({ selectedIndustry, onChange, theme = "dark" }: IndustrySelectorProps) {
  const [customIndustry, setCustomIndustry] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const handleSelectPreset = (ind: string) => {
    setIsCustom(false);
    onChange(ind);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomIndustry(e.target.value);
    onChange(e.target.value);
  };

  const handleEnableCustom = () => {
    setIsCustom(true);
    onChange(customIndustry || "Fintech");
  };

  const isDark = theme === "dark";

  return (
    <div id="industry-selector" className="space-y-3">
      <div className="flex items-center justify-between">
        <label className={`text-xs font-bold uppercase tracking-wider font-display flex items-center gap-1.5 transition-colors duration-500 ease-in-out ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          <Briefcase size={14} className={`transition-colors duration-500 ease-in-out ${isDark ? "text-slate-400" : "text-slate-500"}`} />
          <span>Industry Sector</span>
        </label>
        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-medium border transition-all duration-500 ease-in-out ${
          isDark 
            ? "text-violet-400 bg-violet-950/40 border-violet-800/40" 
            : "text-blue-600 bg-blue-50 border-blue-100"
        }`}>
          {selectedIndustry || "Not Selected"}
        </span>
      </div>

      {/* Preset Chips */}
      <div className="flex flex-wrap gap-1.5">
        {INDUSTRY_PRESETS.map((ind, idx) => {
          const isSelected = !isCustom && selectedIndustry === ind;
          return (
            <motion.button
              key={ind}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02 }}
              onClick={() => handleSelectPreset(ind)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-all duration-500 ease-in-out ${
                isSelected
                  ? isDark
                    ? "border-violet-500 bg-violet-950/40 text-violet-100 ring-2 ring-violet-500/10"
                    : "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/10"
                  : isDark
                    ? "border-slate-800/80 hover:border-slate-700 bg-slate-900/40 text-slate-400"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-600"
              }`}
            >
              {ind}
            </motion.button>
          );
        })}

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleEnableCustom}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-all duration-500 ease-in-out ${
            isCustom
              ? isDark
                ? "border-violet-500 bg-violet-950 text-violet-300 ring-2 ring-violet-500/10"
                : "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/10"
              : isDark
                ? "border-slate-800/80 hover:border-slate-700 bg-slate-900/40 text-slate-400"
                : "border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-600"
          }`}
        >
          ✏️ Custom...
        </motion.button>
      </div>

      {isCustom && (
        <motion.div 
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-1"
        >
          <input
            type="text"
            value={customIndustry}
            onChange={handleCustomChange}
            placeholder="Type your niche (e.g. Cybersecurity, Devops, SpaceTech)"
            className={`w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 font-sans transition-all duration-500 ease-in-out ${
              isDark
                ? "bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:ring-violet-500/20 focus:border-violet-500"
                : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
            maxLength={50}
          />
        </motion.div>
      )}
    </div>
  );
}

