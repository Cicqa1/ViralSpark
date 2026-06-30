# ViralSpark — AI Social Media Post Builder & Copywriting Dashboard

ViralSpark is a high-performance, responsive full-stack web application designed to craft, preview, and automate platform-optimized social media posts. Powered by Google Gemini, the app helps builders, developers, and creators convert raw topics or career accomplishments into high-converting copies for LinkedIn and Twitter (X).

---

## 🌟 Key Features

*   **Dynamic Platform Optimizations**: Tailors character density, hook styles, emoji usage, and hashtag guidelines for both **LinkedIn** and **Twitter (X)**.
*   **Live Visual Mockup Previews**: Instantly renders standard, interactive preview layouts representing how the post will look on actual feeds.
*   **Intelligent Tone & Industry Selector**: Fine-tune your copywriting utilizing presets (e.g., Professional, Bold, Witty) or custom inputs targeting specific sectors (e.g., SpaceTech, Fintech).
*   **Adaptive Dual-Theme Interface**: Seamless toggle between a polished dark theme ("Cosmic Slate") and a high-contrast clean light mode.
*   **Automation Webhook Dispatcher**: Direct integration with automation platforms (e.g., Make.com, Zapier) to stream completed posts immediately into active publication pipelines.
*   **Generation History & Recovery Log**: Durable client-side cache storing previous copies, letting you review, copy, delete, or restore parameters instantly back into the main preview editor.

---

## 🚀 Tech Stack

*   **Frontend**: React (TypeScript), Tailwind CSS, Framer Motion (for responsive UI micro-interactions).
*   **Backend**: Express.js server routing requests securely.
*   **AI Engine**: Powered securely via server-side Google Gemini 3.5 Flash Model APIs (Google Gen AI SDK).
*   **Icons**: Lucide React.

---

## 🛠️ Installation & Setup

Follow these steps to run ViralSpark locally on your machine:

### 1. Clone the Repository
```bash
git clone <your-github-repository-url>
cd viralspark
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and append your Google Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
The server will start, exposing the application on port `3000`. Open `http://localhost:3000` in your browser.

---

## 📦 Building for Production

Compile both frontend static files and server bundle using:
```bash
npm run build
npm run start
```

---

## ⚙️ How to Export to GitHub from Google AI Studio

To export this project directly to your GitHub account:
1. Locate the **Settings** gear icon or top-right menu in the **Google AI Studio Build** workspace.
2. Select **Export to GitHub** or **Export ZIP**.
3. Follow the authentication flow to link your GitHub repository and commit your pristine, ready-to-run code.
