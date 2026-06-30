import React, { useState, useEffect } from "react";
import { Sparkles, Linkedin, Twitter, Copy, Check, RotateCcw, Send, HelpCircle, FileText, AlertCircle, RefreshCw, Webhook, ExternalLink, History, Trash2, Calendar, Sun, Moon } from "lucide-react";
import { Platform, PostInput, GenerationState, HistoryItem } from "./types";
import { TONE_PRESETS, INDUSTRY_PRESETS, SAMPLE_TOPICS } from "./data";
import ToneSelector from "./components/ToneSelector";
import IndustrySelector from "./components/IndustrySelector";
import LinkedInPreview from "./components/LinkedInPreview";
import TwitterPreview from "./components/TwitterPreview";
import { motion, AnimatePresence } from "motion/react";

const logoIcon = new URL("./assets/images/regenerated_image_1782810986516.png", import.meta.url).href;

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const isDark = theme === "dark";

  const [input, setInput] = useState<PostInput>({
    topic: "",
    tone: "Professional",
    industry: "Software Development",
    platform: "LinkedIn",
  });

  const [state, setState] = useState<GenerationState>({
    loading: false,
    error: null,
    result: null,
  });

  const [copied, setCopied] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  const [webhookUrl, setWebhookUrl] = useState("https://hook.eu1.make.com/fgge8npu5tpamwkleit12lmt795d2ei7");
  const [webhookSending, setWebhookSending] = useState(false);
  const [webhookResult, setWebhookResult] = useState<{ success: boolean; msg: string } | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("viralspark_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("viralspark_history", JSON.stringify(history));
    } catch (err) {
      console.error("Failed to save history", err);
    }
  }, [history]);

  const triggerWebhookWithContent = async (generatedPost: string, currentWebhookUrl: string, historyId?: string) => {
    if (!generatedPost || !currentWebhookUrl.trim()) return;

    setWebhookSending(true);
    setWebhookResult(null);

    try {
      const payload = {
        topic: input.topic,
        tone: input.tone,
        industry: input.industry,
        platform: input.platform,
        post: generatedPost,
        generatedAt: new Date().toISOString(),
        author: "mariamimari208@gmail.com"
      };

      const res = await fetch("/api/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl: currentWebhookUrl, payload }),
      });

      if (!res.ok) {
        throw new Error("HTTP error " + res.status);
      }

      const data = await res.json();
      if (data.success) {
        setWebhookResult({
          success: true,
          msg: `Auto-transmitted! Make.com automation triggered successfully.`
        });
        if (historyId) {
          setHistory(prev => prev.map(item => item.id === historyId ? { ...item, webhookStatus: 'sent' } : item));
        }
      } else {
        setWebhookResult({
          success: false,
          msg: `Failed: Status ${data.status} from endpoint.`
        });
        if (historyId) {
          setHistory(prev => prev.map(item => item.id === historyId ? { ...item, webhookStatus: 'failed' } : item));
        }
      }
    } catch (err: any) {
      console.error(err);
      setWebhookResult({
        success: false,
        msg: err.message || "Failed to trigger webhook. Ensure URL is correct."
      });
      if (historyId) {
        setHistory(prev => prev.map(item => item.id === historyId ? { ...item, webhookStatus: 'failed' } : item));
      }
    } finally {
      setWebhookSending(false);
    }
  };

  const steps = [
    "აანალიზებს ტრენდულ ჰუკებს...",
    "ადგენს აბზაცების სტრუქტურას...",
    "არგებს სამიზნე აუდიტორიის ტონს...",
    "ხვეწს მოწოდებას მოქმედებისკენ...",
    "ახდენს შესაბამისი ჰეშთეგების ოპტიმიზაციას..."
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.topic.trim()) return;

    setState({ loading: true, error: null, result: null });
    setCopied(false);
    setWebhookResult(null);

    // Dynamic loading text cycle
    let stepIdx = 0;
    setLoadingStep(steps[stepIdx]);
    const stepInterval = setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      setLoadingStep(steps[stepIdx]);
    }, 1200);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate post");
      }

      const data = await response.json();
      setState({
        loading: false,
        error: null,
        result: data.post,
      });

      // Create history record
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        topic: input.topic,
        tone: input.tone,
        industry: input.industry,
        platform: input.platform,
        post: data.post,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        webhookStatus: webhookUrl.trim() ? 'none' : 'none',
      };

      setHistory(prev => [newHistoryItem, ...prev]);

      // Automatically trigger the webhook
      if (webhookUrl.trim()) {
        triggerWebhookWithContent(data.post, webhookUrl, newHistoryItem.id);
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      setState({
        loading: false,
        error: err.message || "Something went wrong. Please check your credentials and try again.",
        result: null,
      });
    }
  };

  const loadPreset = (preset: typeof SAMPLE_TOPICS[0]) => {
    setInput({
      topic: preset.topic,
      tone: preset.tone,
      industry: preset.industry,
      platform: preset.platform,
    });
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!state.result) return;
    try {
      await navigator.clipboard.writeText(state.result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const handleReset = () => {
    setInput({
      topic: "",
      tone: "Professional",
      industry: "Software Development",
      platform: "LinkedIn",
    });
    setState({
      loading: false,
      error: null,
      result: null,
    });
    setCopied(false);
  };

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-violet-600 selection:text-white transition-colors duration-500 ease-in-out ${
      isDark ? "bg-[#0d0f12] text-slate-200" : "bg-[#f8fafc] text-slate-800"
    }`}>
      {/* Upper Brand Bar */}
      <header className={`border-b sticky top-0 z-50 transition-colors duration-500 ease-in-out ${
        isDark 
          ? "border-slate-800 bg-[#0d0f12]/80 backdrop-blur-md shadow-md shadow-black/10" 
          : "border-slate-200 bg-white/80 backdrop-blur-md shadow-sm shadow-slate-100"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={logoIcon} alt="ViralSpark Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h1 className={`font-bold tracking-tight text-base sm:text-lg flex items-center gap-1.5 font-display transition-colors duration-500 ${
                isDark ? "text-slate-100" : "text-slate-900"
              }`}>
                ViralSpark
                <span className={`text-[10px] font-bold font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border transition-colors duration-500 ${
                  isDark
                    ? "text-violet-400 bg-violet-950/40 border-violet-800/40"
                    : "text-blue-600 bg-blue-50 border-blue-100"
                }`}>
                  AI Social Manager
                </span>
              </h1>
              <p className={`text-xs hidden sm:block transition-colors duration-500 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Platform-Optimized Social Media Post Builder
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Design theme switcher */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.08 }}
              onClick={() => setTheme(isDark ? "light" : "dark")}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={`p-2 rounded-xl border transition-all duration-500 cursor-pointer flex items-center justify-center overflow-hidden ${
                isDark 
                  ? "bg-slate-900/60 border-slate-800 text-amber-400 hover:text-amber-300 hover:bg-slate-850/80" 
                  : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: -15, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 15, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="flex items-center justify-center"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Input Panel */}
          <div className={`lg:col-span-5 rounded-2xl border overflow-hidden backdrop-blur-sm transition-all duration-500 ease-in-out ${
            isDark 
              ? "bg-[#13171e]/70 border-slate-800/80 shadow-2xl shadow-black/20" 
              : "bg-white border-slate-200/80 shadow-lg shadow-slate-100"
          }`}>
            <div className={`p-5 border-b flex items-center justify-between transition-all duration-500 ease-in-out ${
              isDark ? "border-slate-800/60 bg-slate-900/30" : "border-slate-100 bg-slate-50/50"
            }`}>
              <h2 className={`font-bold text-sm flex items-center gap-1.5 font-display tracking-wide transition-colors duration-500 ease-in-out ${
                isDark ? "text-slate-200" : "text-slate-800"
              }`}>
                <FileText size={16} className={`transition-colors duration-500 ease-in-out ${isDark ? "text-violet-400" : "text-blue-500"}`} />
                <span>Post Builder Parameters</span>
              </h2>
              {input.topic && (
                <button
                  type="button"
                  onClick={handleReset}
                  className={`text-xs flex items-center gap-1 font-medium cursor-pointer transition-all duration-500 ease-in-out ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  } hover:opacity-80`}
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <form onSubmit={handleGenerate} className="p-5 space-y-6">
              
              {/* Target Platform Select */}
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider font-display transition-colors duration-500 ease-in-out ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}>
                  Target Social Platform
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setInput({ ...input, platform: "LinkedIn" })}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold cursor-pointer transition-all duration-500 ease-in-out ${
                      input.platform === "LinkedIn"
                        ? isDark
                          ? "border-blue-500 bg-blue-950/30 text-blue-300 ring-2 ring-blue-500/10"
                          : "border-blue-500 bg-blue-50/70 text-blue-800 ring-2 ring-blue-500/10"
                        : isDark
                          ? "border-slate-800/80 hover:border-slate-700 bg-slate-900/40 text-slate-400"
                          : "border-slate-200 hover:border-slate-300 bg-white text-slate-600"
                    }`}
                  >
                    <Linkedin size={18} className={`transition-colors duration-500 ease-in-out ${input.platform === "LinkedIn" ? (isDark ? "text-blue-400" : "text-blue-600") : "text-slate-500"}`} />
                    <span>LinkedIn Post</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setInput({ ...input, platform: "Twitter" })}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold cursor-pointer transition-all duration-500 ease-in-out ${
                      input.platform === "Twitter"
                        ? isDark
                          ? "border-slate-100 bg-slate-900/60 text-slate-100 ring-2 ring-slate-100/10"
                          : "border-slate-900 bg-slate-50 text-slate-900 ring-2 ring-slate-900/10"
                        : isDark
                          ? "border-slate-800/80 hover:border-slate-700 bg-slate-900/40 text-slate-400"
                          : "border-slate-200 hover:border-slate-300 bg-white text-slate-600"
                    }`}
                  >
                    <Twitter size={18} className={`transition-colors duration-500 ease-in-out ${input.platform === "Twitter" ? (isDark ? "text-slate-100" : "text-slate-800") : "text-slate-500"}`} />
                    <span>Twitter (X) Post</span>
                  </motion.button>
                </div>
              </div>

              {/* Presets Row */}
              <div className="space-y-2">
                <span className={`text-xs font-bold uppercase tracking-wider font-display block transition-colors duration-500 ease-in-out ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}>
                  Quick Sample Presets
                </span>
                <div className={`grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1 border rounded-xl p-1.5 font-sans transition-all duration-500 ease-in-out ${
                  isDark 
                    ? "border-slate-800/60 bg-slate-950/60" 
                    : "border-slate-200 bg-slate-50"
                }`}>
                  {SAMPLE_TOPICS.map((preset, index) => (
                    <motion.button
                      key={index}
                      type="button"
                      whileHover={{ x: 3, backgroundColor: isDark ? "rgba(30, 41, 59, 0.4)" : "rgba(255, 255, 255, 0.8)" }}
                      onClick={() => loadPreset(preset)}
                      className={`text-left px-2.5 py-2 rounded-lg text-xs border border-transparent hover:border-slate-850 font-medium flex items-center justify-between cursor-pointer transition-all duration-500 ease-in-out ${
                        isDark ? "text-slate-300 hover:text-slate-100" : "text-slate-700 hover:text-slate-900"
                      }`}
                    >
                      <span className="truncate pr-3">{preset.label}</span>
                      <span className={`text-[9px] font-mono uppercase font-semibold shrink-0 px-1.5 py-0.5 rounded border transition-all duration-500 ease-in-out ${
                        isDark
                          ? "text-violet-400 bg-violet-950/30 border-violet-800/30"
                          : "text-blue-600 bg-blue-50 border-blue-100"
                      }`}>
                        {preset.category}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Topic Input Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="topic-input" className={`text-xs font-bold uppercase tracking-wider font-display transition-colors duration-500 ease-in-out ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}>
                    Topic / Core Accomplishment
                  </label>
                  <span className={`text-[10px] font-mono transition-colors duration-500 ease-in-out ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    {input.topic.length} characters
                  </span>
                </div>
                <textarea
                  id="topic-input"
                  rows={4}
                  value={input.topic}
                  onChange={(e) => setInput({ ...input, topic: e.target.value })}
                  placeholder="Paste details of your project, product launch, career lesson, or coding insight here..."
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-500 ease-in-out leading-relaxed ${
                    isDark
                      ? "bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:ring-violet-500/20 focus:border-violet-500"
                      : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-blue-500/20 focus:border-blue-500"
                  }`}
                  required
                />
              </div>

              {/* Copywriting Tone Select */}
              <ToneSelector
                selectedTone={input.tone}
                onChange={(tone) => setInput({ ...input, tone })}
                theme={theme}
              />

              {/* Industry Sector Chip Select */}
              <IndustrySelector
                selectedIndustry={input.industry}
                onChange={(industry) => setInput({ ...input, industry })}
                theme={theme}
              />

              {/* Webhook Automation Settings */}
              <div className={`border-t pt-4 space-y-2 transition-colors duration-500 ease-in-out ${isDark ? "border-slate-800/60" : "border-slate-100"}`}>
                <div className="flex items-center gap-1.5">
                  <Webhook size={14} className={`transition-colors duration-500 ease-in-out ${isDark ? "text-violet-400" : "text-blue-500"} shrink-0`} />
                  <label htmlFor="webhook-url" className={`text-xs font-bold uppercase tracking-wider font-display transition-colors duration-500 ease-in-out ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}>
                    Auto-Post Webhook URL (Optional)
                  </label>
                </div>
                <input
                  id="webhook-url"
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="e.g. https://hook.eu1.make.com/..."
                  className={`w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 transition-all duration-500 ease-in-out ${
                    isDark
                      ? "bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:ring-violet-500/20 focus:border-violet-500"
                      : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-blue-500/20 focus:border-blue-500"
                  }`}
                />
                <p className={`text-[10px] leading-normal transition-colors duration-500 ease-in-out ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  If set, generated posts are automatically forwarded to Make.com instantly upon generation.
                </p>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                disabled={state.loading || !input.topic.trim()}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all duration-500 ease-in-out cursor-pointer ${
                  state.loading || !input.topic.trim()
                    ? isDark
                      ? "bg-slate-800/40 text-slate-500 border border-slate-800/40 cursor-not-allowed shadow-none"
                      : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
                    : isDark
                      ? "bg-violet-600 hover:bg-violet-700 text-white hover:shadow-violet-600/10 hover:shadow-lg"
                      : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-600/10 hover:shadow-lg"
                }`}
              >
                {state.loading ? (
                  <>
                    <RefreshCw className="animate-spin text-violet-200" size={18} />
                    <span>Writing Copy...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} className="text-violet-200" />
                    <span>Generate Platform Post</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* Right Column - Generation Output and Real-time Interactive Previews */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Display State Loader / Placeholder */}
            {state.loading ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`border rounded-2xl p-12 text-center shadow-2xl space-y-4 backdrop-blur-sm transition-all duration-500 ease-in-out ${
                  isDark
                    ? "bg-[#13171e]/70 border-slate-800/80 shadow-black/20 text-slate-100"
                    : "bg-white border-slate-200/80 shadow-slate-100 text-slate-800"
                }`}
              >
                <div className="flex justify-center">
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-full border-4 border-t-violet-500 animate-spin ${
                      isDark ? "border-violet-950/50" : "border-violet-100"
                    }`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles size={20} className={isDark ? "text-violet-400 animate-pulse" : "text-blue-500 animate-pulse"} />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className={`font-bold text-base font-display ${isDark ? "text-slate-100" : "text-slate-900"}`}>Crafting Copy</h3>
                  <p className={`text-xs font-semibold tracking-wider font-mono uppercase animate-pulse ${
                    isDark ? "text-violet-400" : "text-blue-600"
                  }`}>
                    {loadingStep}
                  </p>
                </div>
                <p className={`text-xs max-w-xs mx-auto leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Our Social Media copywriter is formatting hook lines, emojis, structured paragraphs, and hashtags.
                </p>
              </motion.div>
            ) : state.error ? (
              <motion.div 
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-2xl p-6 shadow-2xl space-y-3 transition-all duration-500 ease-in-out ${
                  isDark
                    ? "bg-rose-950/20 border-rose-900/50 text-slate-200"
                    : "bg-rose-50 border-rose-200 text-rose-900"
                }`}
              >
                <div className={`flex items-center gap-2 font-bold font-display ${isDark ? "text-rose-400" : "text-rose-600"}`}>
                  <AlertCircle size={20} />
                  <span>Generation Failed</span>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? "text-rose-300" : "text-rose-700"}`}>
                  {state.error}
                </p>
                <div className="pt-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerate}
                    className={`px-4 py-2 border font-bold rounded-xl text-xs cursor-pointer transition flex items-center gap-1.5 ${
                      isDark
                        ? "bg-slate-900 border-slate-800 text-rose-400 hover:bg-slate-850"
                        : "bg-white border-rose-200 text-rose-600 hover:bg-rose-50/50"
                    }`}
                  >
                    <RefreshCw size={12} />
                    <span>Try Again</span>
                  </motion.button>
                </div>
              </motion.div>
            ) : state.result ? (
              <div className="space-y-6">
                
                {/* Generation Output Editor Controls */}
                <div className={`border rounded-2xl p-5 shadow-2xl space-y-4 backdrop-blur-sm transition-all duration-500 ease-in-out ${
                  isDark
                    ? "bg-[#13171e]/70 border-slate-800/80 shadow-black/20"
                    : "bg-white border-slate-200/80 shadow-slate-100"
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50"></div>
                      <span className={`text-xs font-bold uppercase tracking-wider font-display transition-colors duration-500 ease-in-out ${
                        isDark ? "text-slate-300" : "text-slate-800"
                      }`}>
                        Generated Copywriting Result
                      </span>
                      
                      {/* Webhook Transmission Status Indicators */}
                      {webhookSending && (
                        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse font-mono transition-all duration-500 ease-in-out ${
                          isDark 
                            ? "text-violet-300 bg-violet-950/40 border-violet-800/40" 
                            : "text-blue-600 bg-blue-50 border border-blue-100"
                        }`}>
                          <RefreshCw size={10} className={`animate-spin transition-colors duration-500 ease-in-out ${isDark ? "text-violet-400" : "text-blue-500"}`} />
                          <span>Dispatching to Make.com...</span>
                        </span>
                      )}
                      {!webhookSending && webhookResult && (
                        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border font-mono transition-all duration-500 ease-in-out ${
                          webhookResult.success
                            ? "text-emerald-400 bg-emerald-950/40 border-emerald-900/50"
                            : "text-rose-400 bg-rose-950/40 border-rose-900/50"
                        }`}>
                          {webhookResult.success ? <Check size={10} /> : <AlertCircle size={10} />}
                          <span className="max-w-[200px] truncate">
                            {webhookResult.success ? "Auto-Sent" : "Send Failed"}
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCopy}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer font-mono transition-all duration-500 ease-in-out ${
                          copied
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                            : isDark
                              ? "bg-slate-800/80 hover:bg-slate-700 text-slate-200"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copied ? "Copied!" : "Copy Post"}</span>
                      </motion.button>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border relative group transition-all duration-500 ease-in-out ${
                    isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <textarea
                      rows={10}
                      value={state.result}
                      onChange={(e) => setState({ ...state, result: e.target.value })}
                      className={`w-full bg-transparent border-none resize-y text-sm leading-relaxed focus:outline-none focus:ring-0 select-text font-sans font-normal transition-colors duration-500 ease-in-out ${
                        isDark ? "text-slate-200" : "text-slate-800"
                      }`}
                      placeholder="Post content will appear here..."
                    />
                    <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-[10px] text-slate-500 font-medium font-mono pointer-events-none">
                      Editable Area
                    </div>
                  </div>
                </div>

                {/* Real-time Visual Platform Feed Mock */}
                <div className="space-y-3">
                  <h3 className={`text-xs font-bold uppercase tracking-wider font-display px-1 transition-colors duration-500 ease-in-out ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}>
                    Live Feed Mockup Preview
                  </h3>
                  {input.platform === "LinkedIn" ? (
                    <LinkedInPreview content={state.result} userEmail="mariamimari208@gmail.com" industry={input.industry} />
                  ) : (
                    <TwitterPreview content={state.result} userEmail="mariamimari208@gmail.com" />
                  )}
                </div>

              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`border rounded-2xl p-12 text-center shadow-xl space-y-4 backdrop-blur-xs transition-all duration-500 ease-in-out ${
                  isDark
                    ? "bg-[#13171e]/40 border-slate-800/60"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border transition-all duration-500 ease-in-out ${
                  isDark
                    ? "bg-violet-950/40 text-violet-400 border-violet-800/40"
                    : "bg-blue-50 text-blue-600 border-blue-100"
                }`}>
                  <Sparkles size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className={`font-bold text-base font-display transition-colors duration-500 ease-in-out ${isDark ? "text-slate-100" : "text-slate-800"}`}>Your High-Converting Post Awaits</h3>
                  <p className={`text-xs max-w-xs mx-auto leading-relaxed transition-colors duration-500 ease-in-out ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Fill out the builder form parameters on the left and click generate to render a platform-optimized mockup preview.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      loadPreset(SAMPLE_TOPICS[0]);
                    }}
                    className={`text-xs font-bold font-mono underline cursor-pointer transition-colors duration-500 ease-in-out ${
                      isDark ? "text-violet-400 hover:text-violet-300" : "text-blue-600 hover:text-blue-500"
                    }`}
                  >
                    Load first example to test run
                  </button>
                </div>
              </motion.div>
            )}

            {/* Platform Strategy Guide */}
            <div className={`border rounded-2xl p-5 space-y-3 transition-all duration-500 ease-in-out ${
              isDark
                ? "bg-[#13171e]/40 border-slate-800/60"
                : "bg-white border-slate-200/80"
            }`}>
              <h4 className={`text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider font-display transition-colors duration-500 ease-in-out ${
                isDark ? "text-slate-300" : "text-slate-800"
              }`}>
                <HelpCircle size={14} className={`transition-colors duration-500 ease-in-out ${isDark ? "text-violet-400" : "text-blue-500"}`} />
                <span>Expert Copywriter Strategy Guide</span>
              </h4>
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed font-sans transition-colors duration-500 ease-in-out ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}>
                <div>
                  <h5 className={`font-bold mb-1 flex items-center gap-1 font-display ${
                    isDark ? "text-slate-200" : "text-slate-800"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm"></span>
                    LinkedIn Playbook
                  </h5>
                  <p>
                    Ensure your first line acts as an undeniable hook. Use structured bullet points to keep information readable. Break up text with generous space. Add clear CTAs to encourage comment section threads.
                  </p>
                </div>
                <div>
                  <h5 className={`font-bold mb-1 flex items-center gap-1 font-display ${
                    isDark ? "text-slate-200" : "text-slate-800"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full shadow-md ${isDark ? "bg-slate-100" : "bg-slate-900"}`}></span>
                    Twitter (X) Playbook
                  </h5>
                  <p>
                    Focus strictly on brevity, punchiness, and emotional spikes. Keep it under 280 characters to fit the default feed box. Keep hashtags to a bare minimum (1-2) to avoid algorithmic throttling.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div id="history-section" className={`mt-8 border rounded-2xl p-5 shadow-2xl space-y-4 backdrop-blur-sm transition-all duration-500 ease-in-out ${
            isDark
              ? "bg-[#13171e]/70 border-slate-800/80 shadow-black/20"
              : "bg-white border-slate-200/80 shadow-slate-100"
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 transition-colors duration-500 ease-in-out ${isDark ? "border-slate-800" : "border-slate-100"}`}>
              <div className="flex items-center gap-2">
                <History size={18} className={`transition-colors duration-500 ease-in-out ${isDark ? "text-violet-400" : "text-blue-500"}`} />
                <h3 className={`font-bold text-sm font-display tracking-wide transition-colors duration-500 ease-in-out ${isDark ? "text-slate-100" : "text-slate-800"}`}>Copywriting Generation History ({history.length})</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to clear your entire history?")) {
                    setHistory([]);
                  }
                }}
                className={`text-xs font-mono font-medium cursor-pointer transition-colors duration-500 ease-in-out flex items-center gap-1 bg-transparent border-none outline-none ${
                  isDark ? "text-rose-400 hover:text-rose-300" : "text-rose-600 hover:text-rose-700"
                }`}
              >
                <Trash2 size={13} />
                <span>Clear All</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-xl p-4 transition-all duration-500 ease-in-out relative group flex flex-col justify-between ${
                    isDark
                      ? "border-slate-800/80 bg-slate-900/20 hover:bg-slate-900/40"
                      : "border-slate-100 bg-slate-50/50 hover:bg-slate-55"
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {item.platform === "LinkedIn" ? (
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 font-mono uppercase ${
                            isDark
                              ? "text-blue-400 bg-blue-950/40 border border-blue-900/40"
                              : "text-blue-700 bg-blue-50 border border-blue-100"
                          }`}>
                            <Linkedin size={10} />
                            <span>LinkedIn</span>
                          </span>
                        ) : (
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 font-mono uppercase ${
                            isDark
                              ? "text-slate-300 bg-slate-800 border border-slate-700/60"
                              : "text-slate-700 bg-slate-100 border border-slate-200"
                          }`}>
                            <Twitter size={10} />
                            <span>Twitter</span>
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-mono">
                          {item.timestamp}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setInput({
                              topic: item.topic,
                              tone: item.tone,
                              industry: item.industry,
                              platform: item.platform
                            });
                            setState({
                              loading: false,
                              error: null,
                              result: item.post
                            });
                            setWebhookResult(null);
                          }}
                          className={`px-2 py-1 border rounded text-[10px] font-mono cursor-pointer transition-all duration-500 ease-in-out ${
                            isDark
                              ? "bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200"
                              : "bg-white hover:bg-slate-100 border-slate-200 text-slate-700"
                          }`}
                          title="Restore to active preview editor"
                        >
                          Restore
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(item.post);
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className={`p-1 rounded cursor-pointer transition-all duration-500 ease-in-out ${
                            isDark
                              ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                          }`}
                          title="Copy content"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setHistory(prev => prev.filter(h => h.id !== item.id));
                          }}
                          className={`p-1 rounded cursor-pointer transition-all duration-500 ease-in-out ${
                            isDark
                              ? "text-slate-500 hover:text-rose-400 hover:bg-rose-950/40"
                              : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          }`}
                          title="Delete history item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[9px] text-slate-400 flex items-center gap-1.5 flex-wrap font-mono uppercase">
                        <span className={`px-1.5 py-0.5 rounded font-semibold border transition-all duration-500 ease-in-out ${
                          isDark
                            ? "bg-slate-800/80 border-slate-700/50 text-slate-300"
                            : "bg-slate-100 border-slate-200 text-slate-600"
                        }`}>{item.tone}</span>
                        <span className={`px-1.5 py-0.5 rounded font-semibold border transition-all duration-500 ease-in-out ${
                          isDark
                            ? "bg-slate-800/80 border-slate-700/50 text-slate-300"
                            : "bg-slate-100 border-slate-200 text-slate-600"
                        }`}>{item.industry}</span>
                        {item.webhookStatus && item.webhookStatus !== 'none' && (
                          <span className={`px-1.5 py-0.5 rounded font-semibold border transition-all duration-500 ease-in-out ${
                            item.webhookStatus === 'sent'
                              ? isDark
                                ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/50"
                                : "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : isDark
                                ? "bg-rose-950/40 text-rose-400 border-rose-900/50"
                                : "bg-rose-50 text-rose-700 border-rose-100"
                          }`}>
                            Webhook: {item.webhookStatus}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs line-clamp-2 italic leading-relaxed transition-colors duration-500 ease-in-out ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        &ldquo;{item.topic}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className={`mt-3 pt-3 border-t text-xs line-clamp-3 whitespace-pre-wrap leading-relaxed select-text p-2.5 rounded-lg font-normal border transition-all duration-500 ease-in-out ${
                    isDark
                      ? "border-slate-800/60 bg-slate-950 text-slate-300 border-slate-900"
                      : "border-slate-100 bg-white text-slate-700 border-slate-200/60"
                  }`}>
                    {item.post}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t mt-16 py-8 transition-all duration-500 ease-in-out ${
        isDark ? "border-slate-900 bg-[#0d0f12]" : "border-slate-200 bg-slate-100/50"
      }`}>
        <div className={`max-w-7xl mx-auto px-4 text-center space-y-2 text-xs transition-colors duration-500 ease-in-out ${isDark ? "text-slate-500" : "text-slate-600"}`}>
          <p>© 2026 ViralSpark Copywriting Dashboard. Designed with high-performance layouts.</p>
          <p className={`font-mono text-[10px] transition-colors duration-500 ease-in-out ${isDark ? "text-slate-600" : "text-slate-500"}`}>Powered securely via server-side Google Gemini 3.5 Flash Model APIs.</p>
        </div>
      </footer>
    </div>
  );
}
