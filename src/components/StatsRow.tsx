import { TrackerData } from "@/lib/types";

function computeStats(data: TrackerData, today: string) {
  const activeDates = Object.keys(data.days)
    .filter((iso) => {
      const d = data.days[iso];
      return d.meditationSessions.length > 0 || d.exercises.length > 0;
    })
    .sort();

  let totalSessions = 0;
  let totalMinutes = 0;
  activeDates.forEach((iso) => {
    const d = data.days[iso];
    totalSessions += d.meditationSessions.length;
    totalMinutes += d.meditationSessions.reduce((sum, s) => sum + s.minutes, 0);
  });

  let streak = 0;
  const cursor = new Date(today + "T00:00:00");
  while (true) {
    const iso =
      cursor.getFullYear() +
      "-" +
      String(cursor.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(cursor.getDate()).padStart(2, "0");
    const d = data.days[iso];
    if (d && (d.meditationSessions.length > 0 || d.exercises.length > 0)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return { streak, totalSessions, totalMinutes };
}

export default function StatsRow({ data, today }: { data: TrackerData; today: string }) {
  const { streak, totalSessions, totalMinutes } = computeStats(data, today);

  const stats = [
    { label: "Day Streak", value: streak },
    { label: "Total Sessions", value: totalSessions },
    { label: "Minutes Meditated", value: totalMinutes },
  ];

  return (
    <div className="flex flex-wrap gap-3 sm:gap-4 justify-center text-center mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex-1 min-w-[100px] bg-[var(--card)] border border-[var(--line)] rounded-xl px-4 py-3 sm:px-5 sm:py-4"
        >
          <div className="text-xl sm:text-2xl font-bold text-[var(--accent-dark)]">{s.value}</div>
          <div className="text-xs text-[var(--muted)]">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
