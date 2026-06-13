export interface CalculatedResults {
  transport: number;
  diet: number;
  energy: number;
  total: number; // in kg CO2 per month
  answers: {
    transportType: string;
    distance: number;
    dietType: string;
    electricity: number;
    heatingType: string;
  };
}

export interface HabitTask {
  id: string;
  title: string;
  category: "Transportation" | "Diet" | "Home Energy";
  co2Savings: number; // kg saved per completion
  points: number; // green points awarded
  completedToday: boolean;
  frequency: "daily" | "weekly";
}

export interface InsightTip {
  title: string;
  category: string;
  impact: string;
  description: string;
}

export interface UserState {
  hasOnboarded: boolean;
  baseline: CalculatedResults | null;
  greenPoints: number;
  savedCo2: number; // total kg saved by checking habits
  completedHabitsList: string[]; // habits completed today
}
