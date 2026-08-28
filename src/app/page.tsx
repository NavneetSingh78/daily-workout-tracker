"use client";

import { useEffect, useState } from "react";
import MeditationCard from "@/components/MeditationCard";
import WorkoutCard from "@/components/WorkoutCard";
import HistoryCard from "@/components/HistoryCard";
import StatsRow from "@/components/StatsRow";
import { useTrackerData } from "@/hooks/useTrackerData";
import { formatDateLabel } from "@/lib/storage";

export default function Home() {
  const { data, loaded, today, addMeditationSession, addExercise, removeExercise, deleteDay } =
    useTrackerData();
  const [todayLabel, setTodayLabel] = useState("");

  useEffect(() => {
    // Date formatting depends on the client's local clock/timezone; must run post-mount to avoid SSR hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTodayLabel(formatDateLabel(today));
  }, [today]);

  const todayExercises = data.days[today]?.exercises ?? [];

  return (
    <div className="mx-auto max-w-3xl w-full px-4 pt-6 pb-16 sm:px-6">
      <header className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold m-0 mb-1">
          Daily Meditation &amp; Workout Tracker
        </h1>
        <p className="text-[var(--muted)] text-sm m-0">{todayLabel}</p>
      </header>

      {!loaded ? (
        <div className="text-center text-sm text-[var(--muted)] py-10">Loading…</div>
      ) : (
        <>
          <StatsRow data={data} today={today} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-start">
            <MeditationCard onComplete={(minutes) => addMeditationSession({ minutes, completedAt: new Date().toISOString() })} />
            <WorkoutCard
              exercises={todayExercises}
              onAdd={addExercise}
              onRemove={(idx) => removeExercise(today, idx)}
            />
          </div>

          <div className="mt-4 sm:mt-5">
            <HistoryCard data={data} today={today} onDeleteDay={deleteDay} />
          </div>
        </>
      )}
    </div>
  );
}
