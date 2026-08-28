"use client";

import { useEffect, useRef, useState } from "react";
import { soundEngine } from "@/lib/soundEngine";
import { SOUND_CHOICE_KEY, SOUND_VOLUME_KEY } from "@/lib/storage";
import { SoundType } from "@/lib/types";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

const SOUND_OPTIONS: { value: SoundType; label: string }[] = [
  { value: "none", label: "None" },
  { value: "drone", label: "Calm Drone" },
  { value: "whitenoise", label: "White Noise" },
  { value: "ocean", label: "Ocean Waves" },
  { value: "bowl", label: "Singing Bowl" },
  { value: "om", label: "Om Chanting" },
];

export default function MeditationCard({
  onComplete,
}: {
  onComplete: (minutes: number) => void;
}) {
  const [duration, setDuration] = useState(15);
  const [remaining, setRemaining] = useState(15 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState("");
  const [sound, setSound] = useState<SoundType>("none");
  const [volume, setVolume] = useState(50);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const savedSound = localStorage.getItem(SOUND_CHOICE_KEY) as SoundType | null;
    const savedVolume = localStorage.getItem(SOUND_VOLUME_KEY);
    // localStorage is a browser-only external system; must sync post-mount to avoid SSR hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedSound) setSound(savedSound);
    if (savedVolume) setVolume(Number(savedVolume));
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      soundEngine.stop();
    };
  }, []);

  function handleDurationChange(val: number) {
    if (isRunning) return;
    let v = val;
    if (isNaN(v) || v < 1) v = 1;
    if (v > 120) v = 120;
    setDuration(v);
    setRemaining(v * 60);
  }

  function handleSoundChange(next: SoundType) {
    setSound(next);
    localStorage.setItem(SOUND_CHOICE_KEY, next);
    if (isRunning) soundEngine.start(next, volume);
  }

  function handleVolumeChange(next: number) {
    setVolume(next);
    localStorage.setItem(SOUND_VOLUME_KEY, String(next));
    soundEngine.setVolume(next);
  }

  function complete(totalSeconds: number) {
    soundEngine.stop();
    const minutes = Math.round(totalSeconds / 60);
    onComplete(minutes);
    setStatus("✓ Session complete and saved!");
    setIsRunning(false);
    setActive(false);
    setRemaining(totalSeconds);
  }

  function handleStart() {
    if (isRunning) return;
    setIsRunning(true);
    setActive(true);
    setStatus("Session in progress…");
    soundEngine.start(sound, volume);
    const totalSeconds = duration * 60;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        const next = r - 1;
        if (next <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          complete(totalSeconds);
          return totalSeconds;
        }
        return next;
      });
    }, 1000);
  }

  function handlePause() {
    if (!isRunning) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setStatus("Paused");
    soundEngine.stop();
  }

  function handleReset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setActive(false);
    setRemaining(duration * 60);
    setStatus("");
    soundEngine.stop();
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-4 sm:p-5">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">🧘 Meditation</h2>
      <div className="flex flex-col items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
          Session length:
          <input
            type="number"
            min={1}
            max={120}
            value={duration}
            disabled={active}
            onChange={(e) => handleDurationChange(parseInt(e.target.value, 10))}
            className="w-16 px-2 py-1 border border-[var(--line)] rounded-md text-[var(--ink)] disabled:opacity-50"
          />
          min
        </label>

        <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
          Background sound:
          <select
            value={sound}
            onChange={(e) => handleSoundChange(e.target.value as SoundType)}
            className="px-2 py-1 border border-[var(--line)] rounded-md text-[var(--ink)] bg-[var(--card)]"
          >
            {SOUND_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
          Volume:
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="w-32"
          />
        </label>

        <div className="text-4xl sm:text-5xl font-semibold tabular-nums text-[var(--accent-dark)]">
          {formatTime(remaining)}
        </div>
        <div className="text-sm text-[var(--muted)] min-h-[1.2em]">{status}</div>

        <div className="flex gap-2 flex-wrap justify-center">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start
          </button>
          <button
            onClick={handlePause}
            disabled={!isRunning}
            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold border border-[var(--accent)] text-[var(--accent-dark)] hover:bg-[var(--accent-soft)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Pause
          </button>
          <button
            onClick={handleReset}
            disabled={!active}
            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold border border-[var(--accent)] text-[var(--accent-dark)] hover:bg-[var(--accent-soft)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
