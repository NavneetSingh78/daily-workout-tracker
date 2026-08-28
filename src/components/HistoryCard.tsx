"use client";

import { TrackerData } from "@/lib/types";
import { exerciseSummary, formatDateLabel } from "@/lib/storage";

export default function HistoryCard({
  data,
  today,
  onDeleteDay,
}: {
  data: TrackerData;
  today: string;
  onDeleteDay: (iso: string) => void;
}) {
  const dates = Object.keys(data.days)
    .filter((iso) => {
      const d = data.days[iso];
      return d.meditationSessions.length > 0 || d.exercises.length > 0;
    })
    .sort()
    .reverse();

  function handleDelete(iso: string) {
    if (confirm("Delete all records for " + formatDateLabel(iso) + "?")) {
      onDeleteDay(iso);
    }
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-4 sm:p-5">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">📜 History</h2>
      {dates.length === 0 ? (
        <div className="text-sm text-[var(--muted)] text-center py-5">
          No history yet — complete a meditation session or log an exercise to get started.
        </div>
      ) : (
        <div>
          {dates.map((iso) => {
            const day = data.days[iso];
            const medMinutes = day.meditationSessions.reduce((sum, s) => sum + s.minutes, 0);
            return (
              <div key={iso} className="border-b border-[var(--line)] last:border-b-0 py-3">
                <div className="flex justify-between items-center font-bold gap-2">
                  <span>
                    {formatDateLabel(iso)}
                    {iso === today ? " (Today)" : ""}
                  </span>
                  <button
                    onClick={() => handleDelete(iso)}
                    className="cursor-pointer shrink-0 rounded-md border border-[var(--warn)] text-[var(--warn)] px-2.5 py-1 text-xs font-semibold hover:bg-[var(--warn-soft)] transition-colors"
                  >
                    Delete Day
                  </button>
                </div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {medMinutes > 0 && (
                    <span className="inline-block bg-[var(--accent-soft)] text-[var(--accent-dark)] rounded-full px-2.5 py-0.5 text-xs font-semibold">
                      🧘 {medMinutes} min meditated
                    </span>
                  )}
                  {day.exercises.length > 0 && (
                    <span className="inline-block bg-[var(--accent-soft)] text-[var(--accent-dark)] rounded-full px-2.5 py-0.5 text-xs font-semibold">
                      🏋️ {day.exercises.length} exercise{day.exercises.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                {day.exercises.length > 0 && (
                  <div className="mt-1.5 text-sm text-[var(--muted)]">
                    {day.exercises.map((ex, i) => (
                      <div key={i} className="py-0.5">
                        • {ex.name} — {exerciseSummary(ex)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
