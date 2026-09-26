"use client";

import {
  ArrowRight,
  Bot,
  BookOpenCheck,
  Clock3,
  CornerDownLeft,
  Maximize2,
  Minimize2,
  Music2,
  Route,
  UserRound,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createStudyMusicEngine,
  type StudyMusicEngine,
} from "@/lib/study-audio";
import { useDemo } from "@/state/demo-provider";

const prompts = [
  "Why is Deadlocks prioritized?",
  "Can I finish this in 4 hours instead?",
  "What happens if I skip Synchronization?",
  "Explain Round Robin simply.",
];

export function AskScreen() {
  const { compressBudget, budgetCompressed, isUpdating } = useDemo();
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [exitQuoteOpen, setExitQuoteOpen] = useState(false);

  const audioEngineRef = useRef<StudyMusicEngine | null>(null);

  const toggleAudio = useCallback(async () => {
    if (!audioEngineRef.current) {
      audioEngineRef.current = createStudyMusicEngine();
    }
    const engine = audioEngineRef.current;
    if (!audioEnabled) {
      await engine.start();
      setAudioEnabled(true);
    } else {
      engine.stop();
      setAudioEnabled(false);
    }
  }, [audioEnabled]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      const inFullscreen = !!document.fullscreenElement;
      setIsFullscreen(inFullscreen);
      if (!inFullscreen) {
        setExitQuoteOpen(true);
      }
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => {
    return () => {
      audioEngineRef.current?.stop();
    };
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!value.trim()) return;
    if (/3\s*hours?/i.test(value)) await compressBudget();
    setSubmitted(true);
  };

  return (
    <div className="ask-layout">
      <div className="page-heading ask-heading">
        <div className="ask-heading-row">
          <div>
            <span className="eyebrow">Ask in context</span>
            <h1>Change the plan, or inspect it.</h1>
            <p>
              Answers stay connected to your course sources and show when they
              affect the route.
            </p>
          </div>
          <div className="ask-study-controls">
            <button
              type="button"
              className={`focus-audio-btn${audioEnabled ? " on" : ""}`}
              onClick={toggleAudio}
              aria-label={
                audioEnabled ? "Turn off ambient music" : "Play ambient music"
              }
            >
              {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>
                {audioEnabled ? "Music playing" : "Play ambient music"}
              </span>
              {audioEnabled && (
                <span className="audio-live-dot" aria-hidden="true" />
              )}
            </button>
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleFullscreen}
              className="fullscreen-toggle-btn"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 size={15} /> Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize2 size={15} /> Fullscreen Study
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      <section className="conversation-card">
        <div className="message system-message">
          <span className="message-avatar">
            <Route size={18} />
          </span>
          <div>
            <span>BackOnTrack</span>
            <p>
              I can explain a recommendation, simplify a concept, or update your
              available study time.
            </p>
            <div className="prompt-chips">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setValue(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
        {submitted || budgetCompressed ? (
          <>
            <div className="message user-message">
              <span className="message-avatar">
                <UserRound size={17} />
              </span>
              <div>
                <span>You</span>
                <p>{value || "I only have 3 hours now."}</p>
              </div>
            </div>
            <div className="message system-message">
              <span className="message-avatar">
                <Bot size={18} />
              </span>
              <div>
                <span>BackOnTrack</span>
                {budgetCompressed ? (
                  <>
                    <h2>Study budget changed: 6h → 3h</h2>
                    <p>
                      I&apos;ve protected the highest-value concepts and your
                      final retrieval check. Lower-value review was removed
                      instead of being squeezed into unrealistic blocks.
                    </p>
                    <div className="structured-intent">
                      <span>
                        <Clock3 size={15} /> Parsed plan input
                      </span>
                      <code>timeBudgetHours: 3</code>
                    </div>
                    <div className="answer-evidence">
                      <span>
                        <BookOpenCheck size={15} /> Plan effect
                      </span>
                      <p>Deadlocks is now the next 35-minute block.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <h2>That question is ready for the learning service.</h2>
                    <p>
                      This frontend keeps conversational content behind the
                      typed API boundary. The 3-hour request is wired for the
                      deterministic demo.
                    </p>
                  </>
                )}
              </div>
            </div>
          </>
        ) : null}
        <form className="ask-composer" onSubmit={submit}>
          <label htmlFor="ask-input" className="sr-only">
            Ask about your plan
          </label>
          <textarea
            id="ask-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Try “I only have 3 hours now.”"
            rows={2}
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Send message"
            disabled={isUpdating}
          >
            <CornerDownLeft size={18} />
          </Button>
        </form>
        <p className="composer-note">
          Try the demo:{" "}
          <button
            type="button"
            onClick={() => setValue("I only have 3 hours now.")}
          >
            I only have 3 hours now.
          </button>
        </p>
      </section>
      {budgetCompressed ? (
        <a href="/student/plan" className="ask-plan-link">
          Review the recalculated route <ArrowRight size={17} />
        </a>
      ) : null}

      {/* ── exit-fullscreen quote overlay ── */}
      <Dialog open={exitQuoteOpen} onOpenChange={setExitQuoteOpen}>
        <DialogContent className="exit-quote-dialog" showClose={false}>
          <DialogTitle className="sr-only">Session paused</DialogTitle>
          <DialogDescription className="sr-only">
            You left fullscreen study mode.
          </DialogDescription>
          <div className="exit-quote-body">
            <div className="exit-quote-brand">
              <BrandMark />
            </div>
            <div className="exit-quote-icon" aria-hidden="true">
              {audioEnabled ? <Music2 size={32} /> : <VolumeX size={32} />}
            </div>
            <blockquote className="exit-quote-text">
              <p>
                &ldquo;Now if you are not on BackOnTrack, you will be on railway
                track.&rdquo;
              </p>
              <footer>&mdash; BackOnTrack</footer>
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
                  await toggleFullscreen();
                }}
              >
                Return to study <ArrowRight size={17} />
              </Button>
              <Button
                variant="secondary"
                onClick={() => setExitQuoteOpen(false)}
              >
                Continue in window
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
