import { PresetTopic } from "./types";

export const TONE_PRESETS = [
  { value: "Professional", label: "💼 Professional", desc: "Authoritative, polished, and business-focused" },
  { value: "Enthusiastic", label: "🚀 Enthusiastic", desc: "High energy, celebratory, and exciting" },
  { value: "Casual", label: "☕ Casual", desc: "Friendly, relaxed, and conversational" },
  { value: "Thought-Provoking", label: "🤔 Thought-Provoking", desc: "Reflective, philosophical, and engaging" },
  { value: "Bold", label: "🔥 Bold & Direct", desc: "Punchy, opinionated, and high-impact" },
  { value: "Educational", label: "🎓 Educational", desc: "Informative, structured, and value-packed" },
];

export const INDUSTRY_PRESETS = [
  "Software Development",
  "Artificial Intelligence",
  "Tech Startup",
  "Product Management",
  "Tech Leadership",
  "Fintech",
  "Web3 & Blockchain",
  "UI/UX Design",
];

export const SAMPLE_TOPICS: PresetTopic[] = [
  {
    label: "🚀 Open Source Project Launch",
    category: "Project Launch",
    topic: "Just open-sourced our highly responsive, lightweight React charts library with zero external dependencies and full dark-mode support. Built using canvas for ultra-performance.",
    tone: "Enthusiastic",
    industry: "Software Development",
    platform: "LinkedIn"
  },
  {
    label: "💡 AI Coding Productivity Insight",
    category: "Opinion",
    topic: "AI tools aren't replacing software engineers; they are empowering junior devs to build full stack prototypes and helping seniors focus on system architecture. The real skill of the future is system synthesis and prompt engineering.",
    tone: "Thought-Provoking",
    industry: "Artificial Intelligence",
    platform: "LinkedIn"
  },
  {
    label: "📈 Startup Pivot Lesson",
    category: "Lessons Learned",
    topic: "We had to pivot our startup's core product last month. It was incredibly painful to throw away 3 months of pristine code, but we learned that customers wanted simple data pipelines rather than complex analytics dashboards.",
    tone: "Professional",
    industry: "Tech Startup",
    platform: "LinkedIn"
  },
  {
    label: "⚡ Twitter Thread: TypeScript Tip",
    category: "Tips & Tricks",
    topic: "Why you should avoid 'any' in TypeScript. Use 'unknown' instead, because it forces you to perform safe type assertions or type checks before invoking methods, keeping your runtime completely safe.",
    tone: "Educational",
    industry: "Software Development",
    platform: "Twitter"
  },
  {
    label: "🇬🇪 ქართული პროექტის გაშვება",
    category: "პროექტი",
    topic: "მოხარული ვარ გაგიზიაროთ, რომ წარმატებით ჩავუშვით ახალი ქართული პლატფორმა, რომელიც ადგილობრივ დეველოპერებს ეხმარება ხელოვნური ინტელექტის ინტეგრაციაში. პროექტი სრულად ღია კოდითაა შექმნილი.",
    tone: "Enthusiastic",
    industry: "Artificial Intelligence",
    platform: "LinkedIn"
  }
];
