"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Exercise, MeditationSession, TrackerData } from "@/lib/types";
import { emptyDay, loadData, saveData, todayISO } from "@/lib/storage";

export function useTrackerData() {
  const [data, setData] = useState<TrackerData>({ days: {} });
  const [loaded, setLoaded] = useState(false);
  const today = useMemo(() => todayISO(), []);

  useEffect(() => {
    // localStorage is a browser-only external system; must sync post-mount to avoid SSR hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(loadData());
    setLoaded(true);
  }, []);

  const persist = useCallback((next: TrackerData) => {
    setData(next);
    saveData(next);
  }, []);

  const addMeditationSession = useCallback(
    (session: MeditationSession) => {
      setData((prev) => {
        const days = { ...prev.days };
        const day = { ...(days[today] ?? emptyDay()) };
        day.meditationSessions = [...day.meditationSessions, session];
        days[today] = day;
        const next = { days };
        saveData(next);
        return next;
      });
    },
    [today]
  );

  const addExercise = useCallback(
    (exercise: Exercise) => {
      setData((prev) => {
        const days = { ...prev.days };
        const day = { ...(days[today] ?? emptyDay()) };
        day.exercises = [...day.exercises, exercise];
        days[today] = day;
        const next = { days };
        saveData(next);
        return next;
      });
    },
    [today]
  );

  const removeExercise = useCallback((iso: string, index: number) => {
    setData((prev) => {
      const day = prev.days[iso];
      if (!day) return prev;
      const days = { ...prev.days };
      days[iso] = { ...day, exercises: day.exercises.filter((_, i) => i !== index) };
      const next = { days };
      saveData(next);
      return next;
    });
  }, []);

  const deleteDay = useCallback((iso: string) => {
    setData((prev) => {
      const days = { ...prev.days };
      delete days[iso];
      const next = { days };
      saveData(next);
      return next;
    });
  }, []);

  return {
    data,
    loaded,
    today,
    addMeditationSession,
    addExercise,
    removeExercise,
    deleteDay,
    persist,
  };
}
