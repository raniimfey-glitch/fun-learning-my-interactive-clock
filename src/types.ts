export type AppMode = 'explore' | 'set-clock' | 'quiz' | 'routine';

export type Language = 'en' | 'ar';

export type PeriodOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface TimeState {
  hours: number; // 0 to 23 or 1-12
  minutes: number; // 0 to 59
  seconds?: number;
}

export interface ClockSettings {
  showMinuteNumbers: boolean;
  showFractionsOverlay: boolean;
  showHandNames: boolean;
  soundEnabled: boolean;
  isLiveTime: boolean;
}

export interface QuizQuestion {
  id: string;
  targetHours: number; // 1-12
  targetMinutes: number; // 0-59
  questionPrompt: string;
  spokenPrompt: string;
  options: {
    id: string;
    text: string;
    spokenText: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  spokenExplanation: string;
}

export interface DailyRoutineItem {
  id: string;
  title: string;
  description: string;
  spokenDescription: string;
  defaultHours: number;
  defaultMinutes: number;
  period: PeriodOfDay;
  iconName: string;
}

export interface AchievementStats {
  stars: number;
  correctAnswers: number;
  quizzesCompleted: number;
  clocksSetCorrectly: number;
  routinesMastered: number;
  streak: number;
}

