# EcoTrack 🌿 — Carbon Footprint Awareness Platform

### 🚀 [Live Deployment Link](https://ais-pre-g7n3vkgc3oueqjtwbfykfs-486125899951.asia-southeast1.run.app)

**EcoTrack** is an interactive, gamified carbon footprint calculator and tracker designed to help users understand, measure, and systematically reduce their daily greenhouse gas emissions. By combining a precision calculator, visually engaging dashboards, interactive habit logging, and customizable Gemini-powered AI recommendations, EcoTrack transforms climate consciousness into a rewarding daily practice.

---

## ✨ Core Features

### 📊 1. Multi-Dimensional Onboarding Calculator
- Measures consumption dynamics across three key pillars: **Transportation**, **Diet**, and **Home Energy**.
- Formulates instantaneous, real-time CO₂ emissions baselines using standard greenhouse gas emissions factors.
- Displays responsive, friendly progress trackers as users complete their profile.

### 📈 2. Interactive Insights Dashboard
- Complements static data with dynamic, visual charting via **Recharts** (Donut & Area views).
- Compares baseline figures against global and local targets to clearly pinpoint where your primary emission sources originate.
- Recalculates remaining net offset configurations in real-time as daily habits are checked off.

### ⚡ 3. Gamified Habit & Action Tracker
- Lists a hand-picked roster of high-impact daily activities (e.g., carpooling, turning down heating, switching to plant-based meals).
- Earn **"Green Points"** and view saved kilograms of CO₂ accumulate in a dynamic dashboard header.
- Create, customize, and delete **Custom Habits** tailored specifically to your unique household or commuting style.

### 💡 4. Tailored Gemini AI Insights Engine
- Secure, server-side implementation utilizes the `@google/genai` TypeScript SDK and the **Gemini 3.5 Flash** model.
- Inspects your personalized onboarding results to automatically generate high-context, prioritized eco-friendly advice and step-by-step suggestions.

### 🔐 5. Offline-First Resilience
- Save progress across sessions and browsers using robust client-side target persistence.
- Zero server database setup is required to run and persist logged habits and custom goals immediately.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4, Motion (Animations), Lucide React
- **Data Visualizations:** Recharts (Responsive charts)
- **Backend Server:** Node.js, Express proxy (for secure server-side API keys)
- **AI Processing:** Google GenAI SDK (Gemini 3.5 Flash)
- **Persistence:** LocalStorage target caching

---

## 🚀 Quick Start / Installation Guide

To run EcoTrack locally on your computer, follow these step-by-step instructions.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ecotrack.git
cd ecotrack
```

### 2. Install Project Dependencies
Use npm to download and install all necessary packages:
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env` file in the root directory (using `.env.example` as a template) and add your AI credentials:
```env
# Secure server-side Gemini API Access
GEMINI_API_KEY="your_actual_gemini_api_key"

# Base Application Host Url
APP_URL="http://localhost:3000"
```

### 4. Start the Local Server
Run the local full-stack server using our bundled environment script:
```bash
npm run dev
```
Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)** to view your running EcoTrack app.

### 5. Production Build & Deployment
To test of build outputs and compile optimization bundles:
```bash
npm run build
npm run start
```

---

## 🛡️ License & Acknowledgements
- Designed with **Eco-Mindfulness** for hackathons and public deployments.
- Powered by Google deep-learning APIs and carbon offset factors.
