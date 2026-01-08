
export interface UserSettings {
  mission: string;
  targetWorkHours: number;
  blacklist: string[];
  isOnboarded: boolean;
}

export interface ActivityRecord {
  id: string;
  appName: string;
  windowTitle: string;
  startTime: number;
  endTime: number;
  isDistraction: boolean;
}

export interface DailySummary {
  date: string;
  totalWorkTime: number; // minutes
  totalDistractionTime: number; // minutes
  records: ActivityRecord[];
}
