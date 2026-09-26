"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Progress from "@radix-ui/react-progress";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  Clock3,
  Lightbulb,
  Music2,
  MusicOff,
  Pause,
  Route,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/brand/brand-mark";
import { PlanChangePanel } from "@/components/plan/plan-change-panel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDemo } from "@/state/demo-provider";

/* â”€â”€â”€ step definitions â”€â”€â”€ */

const steps = [
  { id: 1, label: "Refresh concept", minutes: 8 },
  { id: 2, label: "Guided example", minutes: 10 },
  { id: 3, label: "Retrieval practice", minutes: 10 },
  { id: 4, label: "Mastery check", minutes: 7 },
];

/* â”€â”€â”€ exit quotes â”€â”€â”€ */

const exitQuotes = [
  {
    quote: "Focus is the art of knowing what to ignore.",
    attribution: "Cal Newport",
  },
  {
    quote: "One session at a time. You showed up â€” that's the whole game.",
    attribution: "BackOnTrack",
  },
  {
    quote: "Clarity follows attention. You gave it today.",
    attribution: "BackOnTrack",
  },
  {
    quote: "The CPU can run one process at a time. So can you.",
    attribution: "CPU Scheduling Â· today's block",
  },
];

/* â”€â”€â”€ ambient audio engine â”€â”€â”€ */

type AudioEngine = { stop: () => void };

function createAmbientAudio(): AudioEngine | null {
  if (typeof window === "undefined") return null;
  try {
    const ctx = new AudioContext();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    const g1 = ctx.createGain();
    const g2 = ctx.createGain();
    const g3 = ctx.createGain();
    const master = ctx.createGain();
    const comp = ctx.createDynamicsCompressor();

    osc1.type = "sine";
    osc1.frequency.value = 110;
    osc2.type = "sine";
    osc2.frequency.value = 164.81;
    osc3.type = "sine";
    osc3.frequency.value = 220.05;

    g1.gain.value = 0.04;
    g2.gain.value = 0.03;
    g3.gain.value = 0.025;
    master.gain.value = 0;

    osc1.connect(g1);
    osc2.connect(g2);
    osc3.connect(g3);
    [g1, g2, g3].forEach((g) => g.connect(comp));
    comp.connect(master);
    master.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc3.start();

    master.gain.linearRampToValueAtTime(1, ctx.currentTime + 2);

    const stop = () => {
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      window.setTimeout(() => {
        osc1.stop();
        osc2.stop();
        osc3.stop();
        void ctx.close();
      }, 1600);
    };

    return { stop };
  } catch {
    return null;
  }
}

/* â”€â”€â”€ component â”€â”€â”€ */

export function FocusScreen() {
  const router = useRouter();
  const { completeMasteryCheck, isUpdating, lastChange, masteryComplete } =
    useDemo();

  const [currentStep, setCurrentStep] = useState(masteryComplete ? 4 : 1);
  const [exitOpen, setExitOpen] = useState(false);
  const [rerouteOpen, setRerouteOpen] = useState(false);
  const [returnMessage, setReturnMessage] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [exitQuoteOpen, setExitQuoteOpen] = useState(false);

  const audioRef = useRef<AudioEngine | null>(null);
  const quoteRef = useRef(
    exitQuotes[Math.floor(Math.random() * exitQuotes.length)],
  );
  const quote = quoteRef.current;

  /* â”€â”€ fullscreen â”€â”€ */
  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen?.();
    } catch {
      /* unsupported â€“ silent */
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    void enterFullscreen();
  }, [enterFullscreen]);

  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) {
        setExitQuoteOpen(true);
      }
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  /* â”€â”€ in-app Escape (when not fullscreen) â”€â”€ */
  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (event.defaultPrevented) return;
      if (exitOpen || rerouteOpen || exitQuoteOpen) return;
      if (document.fullscreenElement) return;
      event.preventDefault();
      setExitOpen(true);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [exitOpen, rerouteOpen, exitQuoteOpen]);

  /* â”€â”€ tab return â”€â”€ */
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        setReturnMessage(true);
        window.setTimeout(() => setReturnMessage(false), 3600);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  /* â”€â”€ audio â”€â”€ */
  const toggleAudio = useCallback(() => {
    if (!audioEnabled) {
      audioRef.current = createAmbientAudio();
      setAudioEnabled(true);
    } else {
      audioRef.current?.stop();
      audioRef.current = null;
      setAudioEnabled(false);
    }
  }, [audioEnabled]);

  useEffect(
    () => () => {
      audioRef.current?.stop();
    },
    [],
  );

  /* â”€â”€ helpers â”€â”€ */
  const progress = ((currentStep - 1) / steps.length) * 100;
  const advance = () => setCurrentStep((c) => Math.min(4, c + 1));
  const submitCheck = async () => {
    await completeMasteryCheck();
    setRerouteOpen(true);
  };

  const leaveFocus = useCallback(async () => {
    audioRef.current?.stop();
    audioRef.current = null;
    await exitFullscreen();
    router.push("/student");
  }, [exitFullscreen, router]);

  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  return (
    <div className="focus-page">
      {/* header */}
      <header className="focus-header">
        <BrandMark compact />
        <div className="focus-course">
          <span>CPU Scheduling</span>
          <small>Block 1 of 6</small>
        </div>
        <div className="focus-timer">
          <Clock3 size={17} />
          <span className="mono">12:00 left</span>
        </div>
        <button
          type="button"
          className="focus-audio-btn"
          onClick={toggleAudio}
          aria-label={
            audioEnabled ? "Turn off ambient sound" : "Turn on ambient sound"
          }
        >
          {audioEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          {audioEnabled && (
            <span className="audio-live-dot" aria-hidden="true" />
          )}
        </button>
        <Button variant="secondary" size="sm" onClick={() => setExitOpen(true)}>
          <Pause size={16} /> Pause
        </Button>
      </header>

      <Progress.Root
        className="focus-progress"
        value={progress}
        aria-label={`${progress}% of focus block complete`}
      >
        <Progress.Indicator
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
      </Progress.Root>

      {returnMessage && (
        <div className="return-message">
          Welcome back. Your state survived the context switch.
        </div>
      )}

      <main className="focus-workspace">
        <aside className="focus-steps" aria-label="Session steps">
          <span className="eyebrow">35-minute block</span>
          <ol>
            {steps.map((step) => (
              <li
                key={step.id}
                className={
                  step.id === currentStep
                    ? "current"
                    : step.id < currentStep
                      ? "done"
                      : ""
                }
              >
                <span className="step-index">
                  {step.id < currentStep ? (
                    <Check size={14} />
                  ) : (
                    String(step.id).padStart(2, "0")
                  )}
                </span>
                <div>
                  <strong>{step.label}</strong>
                  <small>{step.minutes} min</small>
                </div>
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="leave-link"
            onClick={() => setExitOpen(true)}
          >
            <ArrowLeft size={15} /> Leave focus mode
          </button>
        </aside>

        <section className="lesson-surface">
          <div className="lesson-goal">
            <span className="eyebrow">Block goal</span>
            <p>
              Compare FCFS, SJF and Round Robin, then calculate basic waiting
              and turnaround time.
            </p>
          </div>

          {currentStep === 1 && (
            <div className="lesson-content">
              <span className="step-kicker">01 Â· Refresh concept</span>
              <h1>
                The CPU can run one process at a time. The policy decides who
                gets it next.
              </h1>
              <div className="concept-grid">
                <article>
                  <span>FCFS</span>
                  <h2>First come, first served</h2>
                  <p>
                    Simple and fair by arrival time, but one long job can hold
                    up the queue.
                  </p>
                </article>
                <article>
                  <span>SJF</span>
                  <h2>Shortest job first</h2>
                  <p>
                    Minimizes average waiting time when burst lengths are known.
                  </p>
                </article>
                <article>
                  <span>RR</span>
                  <h2>Round Robin</h2>
                  <p>
                    Each process gets a time quantum. Responsive, with
                    context-switch cost.
                  </p>
                </article>
              </div>
              <div className="concept-note">
                <Lightbulb size={18} />
                <p>
                  <strong>Keep one distinction in view:</strong> turnaround time
                  covers arrival to completion; waiting time counts time spent
                  ready but not running.
                </p>
              </div>
              <div className="lesson-actions">
                <Button onClick={advance}>
                  Continue to example <ArrowRight size={17} />
                </Button>
                <Button variant="ghost">Explain differently</Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="lesson-content">
              <span className="step-kicker">02 Â· Guided example</span>
              <h1>
                Three processes arrive together. Start by drawing the queue.
              </h1>
              <div
                className="process-table"
                role="table"
                aria-label="Scheduling example"
              >
                <div role="row">
                  <span role="columnheader">Process</span>
                  <span role="columnheader">Burst</span>
                  <span role="columnheader">FCFS order</span>
                </div>
                <div role="row">
                  <strong role="cell">P1</strong>
                  <span role="cell" className="mono">
                    6 ms
                  </span>
                  <span role="cell">1st</span>
                </div>
                <div role="row">
                  <strong role="cell">P2</strong>
                  <span role="cell" className="mono">
                    2 ms
                  </span>
                  <span role="cell">2nd</span>
                </div>
                <div role="row">
                  <strong role="cell">P3</strong>
                  <span role="cell" className="mono">
                    4 ms
                  </span>
                  <span role="cell">3rd</span>
                </div>
              </div>
              <div className="timeline-demo">
                <span style={{ flex: 6 }}>P1 Â· 6</span>
                <span style={{ flex: 2 }}>P2 Â· 2</span>
                <span style={{ flex: 4 }}>P3 Â· 4</span>
              </div>
              <p className="worked-answer">
                Waiting times: P1 = 0, P2 = 6, P3 = 8. Average waiting time ={" "}
                <strong>4.67 ms</strong>.
              </p>
              <div className="lesson-actions">
                <Button onClick={advance}>
                  Try one yourself <ArrowRight size={17} />
                </Button>
                <Button variant="ghost">Show another example</Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="lesson-content">
              <span className="step-kicker">03 Â· Retrieval practice</span>
              <h1>Which scheduler usually minimizes average waiting time?</h1>
              <div className="answer-grid">
                {[
                  "FCFS",
                  "Shortest job first",
                  "Round Robin",
                  "Priority only",
                ].map((answer) => (
                  <button type="button" key={answer}>
                    {answer}
                  </button>
                ))}
              </div>
              <p className="quiet-humour">
                The scheduler has spoken: this process runs first.
              </p>
              <div className="lesson-actions">
                <Button onClick={advance}>
                  Check and continue <ArrowRight size={17} />
                </Button>
                <Button variant="ghost">Give me a hint</Button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="lesson-content mastery-check">
              <span className="step-kicker">04 Â· Mastery check</span>
              <h1>
                {masteryComplete
                  ? "Check complete. Your route has changed."
                  : "You can now distinguish the algorithms and calculate core timings."}
              </h1>
              <p>
                {masteryComplete
                  ? "CPU Scheduling moved above the required threshold. The released time now goes where it helps more."
                  : "For this deterministic pitch demo, submit Riya's completed check to update her mastery."}
              </p>
              <div
                className="mastery-shift"
                aria-label={
                  masteryComplete
                    ? "Mastery changed from 38% to 72%"
                    : "Current mastery 38%"
                }
              >
                <div>
                  <span>Before</span>
                  <strong className="mono">38%</strong>
                </div>
                <ArrowRight aria-hidden="true" />
                <div className={masteryComplete ? "revealed" : "pending"}>
                  <span>After</span>
                  <strong className="mono">
                    {masteryComplete ? "72%" : "â€”"}
                  </strong>
                </div>
              </div>
              <div className="lesson-actions">
                {!masteryComplete ? (
                  <Button onClick={submitCheck} disabled={isUpdating}>
                    {isUpdating ? "Updating routeâ€¦" : "Submit mastery check"}{" "}
                    <Route size={17} />
                  </Button>
                ) : (
                  <Button onClick={() => setRerouteOpen(true)}>
                    See the new route <Route size={17} />
                  </Button>
                )}
              </div>
            </div>
          )}

          <footer className="focus-tools">
            <span>Need another angle?</span>
            <button type="button">
              <CircleHelp size={15} /> Explain differently
            </button>
            <button type="button">Show one example</button>
            <button type="button">Test me</button>
          </footer>
        </section>
      </main>

      {/* â”€â”€ pause / exit alert dialog â”€â”€ */}
      <AlertDialog.Root open={exitOpen} onOpenChange={setExitOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-50 bg-[rgba(23,32,31,.4)]" />
          <AlertDialog.Content className="exit-dialog">
            <div className="exit-icon">
              <Pause size={22} />
            </div>
            <AlertDialog.Title>Leaving already?</AlertDialog.Title>
            <AlertDialog.Description>
              <strong>12 minutes left in this block.</strong>
              <br />
              Your progress is saved.
            </AlertDialog.Description>
            <p className="exit-wit">
              ESC works here. Friday still arrives on schedule.
            </p>
            <div className="exit-actions">
              <AlertDialog.Cancel asChild>
                <Button>Finish the 12 min</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button variant="secondary" onClick={leaveFocus}>
                  Pause &amp; leave
                </Button>
              </AlertDialog.Action>
              <button
                type="button"
                className="end-session"
                onClick={leaveFocus}
              >
                End session
              </button>
            </div>
            <AlertDialog.Cancel
              className="icon-button exit-close"
              aria-label="Close exit dialog"
            >
              <X size={18} />
            </AlertDialog.Cancel>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>

      {/* â”€â”€ reroute dialog â”€â”€ */}
      <Dialog open={rerouteOpen} onOpenChange={setRerouteOpen}>
        <DialogContent className="reroute-dialog">
          <DialogTitle className="sr-only">Plan updated</DialogTitle>
          <DialogDescription className="sr-only">
            The study route changed after the mastery check.
          </DialogDescription>
          {lastChange && <PlanChangePanel change={lastChange} />}
          <div className="reroute-actions">
            <Button onClick={() => router.push("/student/plan")}>
              See what changed <ArrowRight size={17} />
            </Button>
            <Button variant="secondary" onClick={leaveFocus}>
              Return to overview
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* â”€â”€ exit-fullscreen quote overlay â”€â”€ */}
      <Dialog open={exitQuoteOpen} onOpenChange={setExitQuoteOpen}>
        <DialogContent className="exit-quote-dialog" showClose={false}>
          <DialogTitle className="sr-only">Session paused</DialogTitle>
          <DialogDescription className="sr-only">
            You left fullscreen focus mode.
          </DialogDescription>
          <div className="exit-quote-body">
            <div className="exit-quote-brand">
              <BrandMark />
            </div>
            <div className="exit-quote-icon" aria-hidden="true">
              {audioEnabled ? <Music2 size={32} /> : <MusicOff size={32} />}
            </div>
            <blockquote className="exit-quote-text">
              <p>&ldquo;{quote.quote}&rdquo;</p>
              <footer>&mdash; {quote.attribution}</footer>
            </blockquote>
            <div className="exit-quote-audio">
              <button
                type="button"
                className={`audio-toggle-btn${audioEnabled ? " on" : ""}`}
                onClick={toggleAudio}
              >
                {audioEnabled ? (
                  <>
                    <Volume2 size={16} /> Ambient sound on
                    <span className="audio-bars" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                  </>
                ) : (
                  <>
                    <VolumeX size={16} /> Turn on ambient sound
                  </>
                )}
              </button>
            </div>
            <div className="exit-quote-actions">
              <Button
                onClick={async () => {
                  setExitQuoteOpen(false);
                  await enterFullscreen();
                }}
              >
                Return to focus <ArrowRight size={17} />
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setExitQuoteOpen(false);
                  void leaveFocus();
                }}
              >
                End session
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

