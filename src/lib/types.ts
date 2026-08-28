export interface MeditationSession {
  minutes: number;
  completedAt: string;
}

export interface Exercise {
  name: string;
  sets: number | null;
  reps: number | null;
  weight: number | null;
  loggedAt: string;
}

export interface DayRecord {
  meditationSessions: MeditationSession[];
  exercises: Exercise[];
}

export interface TrackerData {
  days: Record<string, DayRecord>;
}

export type SoundType = "none" | "drone" | "whitenoise" | "ocean" | "bowl" | "om";
