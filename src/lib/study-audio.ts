/**
 * Web Audio Ambient Study Music Engine
 * Generates warm, soothing Lo-Fi ambient chords with subtle harmonic movement.
 * Zero external audio files required — runs 100% client-side with zero latency.
 */

export interface StudyMusicEngine {
  start: () => Promise<void>;
  stop: () => void;
  setVolume: (v: number) => void;
  isPlaying: () => boolean;
}

export function createStudyMusicEngine(): StudyMusicEngine {
  let ctx: AudioContext | null = null;
  let masterGain: GainNode | null = null;
  let isRunning = false;
  let timerId: number | null = null;
  let activeNodes: Array<{ stop: () => void; disconnect: () => void }> = [];

  // Lo-Fi Chord progressions in A-Minor / C-Major (peaceful, calming)
  // [root, 3rd, 5th, 7th/9th] frequencies in Hz
  const chords = [
    // Fmaj7
    [174.61, 220.0, 261.63, 329.63],
    // Gsus4 -> G
    [196.0, 246.94, 293.66, 392.0],
    // Em7
    [164.81, 196.0, 246.94, 293.66],
    // Am9
    [110.0, 164.81, 220.0, 261.63, 329.63],
  ];

  let currentChordIndex = 0;

  function playChord(
    context: AudioContext,
    destination: GainNode,
    notes: number[],
  ) {
    // Clean up older completed nodes
    activeNodes = activeNodes.slice(-12);

    const chordGain = context.createGain();
    const filter = context.createBiquadFilter();

    // Warm Lo-Fi lowpass filter
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(480, context.currentTime);
    filter.frequency.linearRampToValueAtTime(620, context.currentTime + 3.5);
    filter.frequency.linearRampToValueAtTime(450, context.currentTime + 7.5);

    chordGain.gain.setValueAtTime(0, context.currentTime);
    chordGain.gain.linearRampToValueAtTime(0.35, context.currentTime + 1.8);
    chordGain.gain.setValueAtTime(0.35, context.currentTime + 6.0);
    chordGain.gain.linearRampToValueAtTime(0, context.currentTime + 8.0);

    chordGain.connect(filter);
    filter.connect(destination);

    const oscillators: OscillatorNode[] = [];

    notes.forEach((freq, idx) => {
      const osc = context.createOscillator();
      const oscGain = context.createGain();

      // Gentle sine + slight triangle warmth for harmonic richness
      osc.type = idx === 0 ? "triangle" : "sine";
      // Slight detune for natural analog chorus/vibe
      osc.frequency.setValueAtTime(freq, context.currentTime);
      osc.detune.setValueAtTime((idx - 1.5) * 4, context.currentTime);

      oscGain.gain.setValueAtTime(idx === 0 ? 0.45 : 0.28, context.currentTime);

      osc.connect(oscGain);
      oscGain.connect(chordGain);

      osc.start(context.currentTime);
      osc.stop(context.currentTime + 8.2);

      oscillators.push(osc);
    });

    // Add a very subtle, soft bell note on top
    const bellFreq = notes[Math.floor(Math.random() * notes.length)] * 2;
    if (bellFreq < 1200) {
      const bell = context.createOscillator();
      const bellGain = context.createGain();
      bell.type = "sine";
      bell.frequency.setValueAtTime(bellFreq, context.currentTime + 1.2);
      bellGain.gain.setValueAtTime(0, context.currentTime + 1.2);
      bellGain.gain.linearRampToValueAtTime(0.08, context.currentTime + 1.3);
      bellGain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + 4.5,
      );

      bell.connect(bellGain);
      bellGain.connect(filter);
      bell.start(context.currentTime + 1.2);
      bell.stop(context.currentTime + 4.6);
      oscillators.push(bell);
    }

    const nodeBundle = {
      stop: () => {
        oscillators.forEach((o) => {
          try {
            o.stop();
          } catch {
            /* ignore */
          }
        });
      },
      disconnect: () => {
        try {
          chordGain.disconnect();
          filter.disconnect();
        } catch {
          /* ignore */
        }
      },
    };

    activeNodes.push(nodeBundle);
  }

  async function start() {
    if (isRunning) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;

      if (!ctx || ctx.state === "closed") {
        ctx = new AudioCtx();
      }

      // CRITICAL: Always resume audio context upon user gesture
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.2);

      // Dynamics compressor for clean, smooth master output
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-18, ctx.currentTime);
      compressor.knee.setValueAtTime(24, ctx.currentTime);
      compressor.ratio.setValueAtTime(3, ctx.currentTime);
      compressor.attack.setValueAtTime(0.01, ctx.currentTime);
      compressor.release.setValueAtTime(0.25, ctx.currentTime);

      masterGain.connect(compressor);
      compressor.connect(ctx.destination);

      isRunning = true;

      // Play first chord immediately
      playChord(ctx, masterGain, chords[currentChordIndex]);
      currentChordIndex = (currentChordIndex + 1) % chords.length;

      // Progressively loop chords every 7.5 seconds
      timerId = window.setInterval(() => {
        if (!isRunning || !ctx || !masterGain) return;
        playChord(ctx, masterGain, chords[currentChordIndex]);
        currentChordIndex = (currentChordIndex + 1) % chords.length;
      }, 7500);
    } catch (err) {
      console.warn("Failed to initialize study ambient audio:", err);
    }
  }

  function stop() {
    isRunning = false;
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
    if (masterGain && ctx && ctx.state === "running") {
      try {
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
      } catch {
        /* ignore */
      }
    }
    window.setTimeout(() => {
      activeNodes.forEach((n) => {
        n.stop();
        n.disconnect();
      });
      activeNodes = [];
      if (ctx && ctx.state !== "closed") {
        void ctx.close();
        ctx = null;
      }
    }, 900);
  }

  function setVolume(volume: number) {
    if (masterGain && ctx) {
      const clamped = Math.max(0, Math.min(1, volume));
      masterGain.gain.setValueAtTime(clamped, ctx.currentTime);
    }
  }

  function isPlaying() {
    return isRunning;
  }

  return { start, stop, setVolume, isPlaying };
}
