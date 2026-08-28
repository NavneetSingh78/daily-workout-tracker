"use client";

import { FormEvent, useState } from "react";
import { Exercise } from "@/lib/types";
import { exerciseSummary } from "@/lib/storage";

export default function WorkoutCard({
  exercises,
  onAdd,
  onRemove,
}: {
  exercises: Exercise[];
  onAdd: (exercise: Exercise) => void;
  onRemove: (index: number) => void;
}) {
  const [name, setName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd({
      name: trimmed,
      sets: sets ? Number(sets) : null,
      reps: reps ? Number(reps) : null,
      weight: weight ? Number(weight) : null,
      loggedAt: new Date().toISOString(),
    });
    setName("");
    setSets("");
    setReps("");
    setWeight("");
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-4 sm:p-5">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">🧘‍♀️ Yoga / Workout</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <label className="flex flex-col gap-1 text-xs text-[var(--muted)]">
          Exercise
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Downward Dog, Squats"
            required
            className="px-2.5 py-2 border border-[var(--line)] rounded-md text-sm text-[var(--ink)]"
          />
        </label>
        <div className="grid grid-cols-3 gap-2">
          <label className="flex flex-col gap-1 text-xs text-[var(--muted)]">
            Sets
            <input
              type="number"
              min={0}
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              placeholder="3"
              className="px-2.5 py-2 border border-[var(--line)] rounded-md text-sm text-[var(--ink)]"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-[var(--muted)]">
            Reps
            <input
              type="number"
              min={0}
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="12"
              className="px-2.5 py-2 border border-[var(--line)] rounded-md text-sm text-[var(--ink)]"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-[var(--muted)]">
            Weight (lbs)
            <input
              type="number"
              min={0}
              step={0.5}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="0"
              className="px-2.5 py-2 border border-[var(--line)] rounded-md text-sm text-[var(--ink)]"
            />
          </label>
        </div>
        <button
          type="submit"
          className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] transition-colors"
        >
          Add Exercise
        </button>
      </form>

      <div className="mt-3.5 flex flex-col gap-2">
        {exercises.length === 0 ? (
          <div className="text-sm text-[var(--muted)] text-center py-5">
            No exercises logged yet today.
          </div>
        ) : (
          exercises.map((ex, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-[var(--accent-soft)] border border-[var(--line)] rounded-lg px-3 py-2 text-sm"
            >
              <div>
                <strong>{ex.name}</strong>
                <div className="text-xs text-[var(--muted)]">{exerciseSummary(ex)}</div>
              </div>
              <button
                onClick={() => onRemove(idx)}
                className="cursor-pointer rounded-md border border-[var(--warn)] text-[var(--warn)] px-2.5 py-1 text-xs hover:bg-[var(--warn-soft)] transition-colors"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
