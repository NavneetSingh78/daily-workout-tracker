import { DayRecord, TrackerData } from "./types";

export const STORAGE_KEY = "meditationWorkoutTracker";
export const SOUND_CHOICE_KEY = "meditationSoundChoice";
export const SOUND_VOLUME_KEY = "meditationSoundVolume";

export function todayISO(): string {
  const d = new Date();
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

export function formatDateLabel(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function loadData(): TrackerData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { days: {} };
    const parsed = JSON.parse(raw);
    if (!parsed.days) parsed.days = {};
    return parsed;
  } catch (e) {
    console.error("Failed to load tracker data", e);
    return { days: {} };
  }
}

export function saveData(data: TrackerData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function emptyDay(): DayRecord {
  return { meditationSessions: [], exercises: [] };
}

export function exerciseSummary(ex: {
  sets: number | null;
  reps: number | null;
  weight: number | null;
}): string {
  const parts: string[] = [];
  if (ex.sets) parts.push(ex.sets + " sets");
  if (ex.reps) parts.push(ex.reps + " reps");
  if (ex.weight) parts.push(ex.weight + " lbs");
  return parts.length ? parts.join(" · ") : "logged";
}
