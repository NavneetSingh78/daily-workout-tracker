import { SoundType } from "./types";

type AnyAudioNode = AudioScheduledSourceNode | AudioNode;

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private nodes: AnyAudioNode[] = [];
  private intervalId: ReturnType<typeof setInterval> | null = null;

  private ensureContext() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
  }

  setVolume(pct: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime((pct / 100) * 0.6, this.ctx.currentTime, 0.1);
    }
  }

  stop() {
    this.nodes.forEach((n) => {
      try {
        (n as AudioScheduledSourceNode).stop?.();
      } catch {}
      try {
        n.disconnect?.();
      } catch {}
    });
    this.nodes = [];
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  start(type: SoundType, volumePct: number) {
    this.stop();
    if (type === "none") return;
    try {
      this.ensureContext();
    } catch (e) {
      console.error("Web Audio not available", e);
      return;
    }
    this.setVolume(volumePct);
    if (type === "drone") this.startDrone();
    else if (type === "whitenoise") this.startNoise(false);
    else if (type === "ocean") this.startNoise(true);
    else if (type === "bowl") this.startBowl();
    else if (type === "om") this.startOm();
  }

  private makeNoiseBuffer(): AudioBuffer {
    const ctx = this.ctx!;
    const size = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  private startDrone() {
    const ctx = this.ctx!;
    const freqs = [110, 165, 220];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      osc.detune.value = (i - 1) * 4;
      const g = ctx.createGain();
      g.gain.value = 0;
      osc.connect(g).connect(this.masterGain!);
      osc.start();
      g.gain.linearRampToValueAtTime(0.16 / freqs.length, ctx.currentTime + 2);
      this.nodes.push(osc, g);
    });
  }

  private startNoise(isOcean: boolean) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.makeNoiseBuffer();
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = isOcean ? 500 : 3000;
    const g = ctx.createGain();
    g.gain.value = 0;
    src.connect(filter).connect(g).connect(this.masterGain!);
    src.start();
    g.gain.linearRampToValueAtTime(isOcean ? 0.28 : 0.14, ctx.currentTime + 1.5);
    this.nodes.push(src, filter, g);
    if (isOcean) {
      let t = 0;
      this.intervalId = setInterval(() => {
        t += 0.15;
        const wave = 0.16 + 0.12 * Math.sin(t);
        g.gain.linearRampToValueAtTime(Math.max(0.04, wave), ctx.currentTime + 0.15);
      }, 150);
    }
  }

  private startBowl() {
    const ctx = this.ctx!;
    const strike = () => {
      const freqs = [220, 330, 440];
      const now = ctx.currentTime;
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = f;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.22 / (i + 1), now + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, now + 6);
        osc.connect(g).connect(this.masterGain!);
        osc.start(now);
        osc.stop(now + 6.2);
      });
    };
    strike();
    this.intervalId = setInterval(strike, 45000);
  }

  private startOm() {
    const ctx = this.ctx!;
    const fundamentals = [136.1, 272.2, 408.3];
    const baseLevels = [0.22, 0.07, 0.03];
    const gains: GainNode[] = [];
    fundamentals.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? "sine" : "triangle";
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0;
      osc.connect(g).connect(this.masterGain!);
      osc.start();
      this.nodes.push(osc, g);
      gains.push(g);
    });
    let t = 0;
    const cycle = 9;
    this.intervalId = setInterval(() => {
      t += 0.1;
      const phase = (t % cycle) / cycle;
      let env;
      if (phase < 0.15) env = phase / 0.15;
      else if (phase < 0.65) env = 1;
      else if (phase < 0.85) env = 1 - (phase - 0.65) / 0.2;
      else env = 0.05;
      gains.forEach((g, i) => {
        g.gain.linearRampToValueAtTime(baseLevels[i] * env, ctx.currentTime + 0.1);
      });
    }, 100);
  }
}

export const soundEngine = new AmbientSoundEngine();
