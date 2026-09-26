"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultPlan, demoStudent, demoTopics } from "@/data/demo/riya";
import { learningApi } from "@/services/api/client";
import type {
  PlanChange,
  RecoveryPlan,
  StudentProfile,
  Topic,
} from "@/services/api/types";

interface DemoState {
  student: StudentProfile;
  plan: RecoveryPlan;
  topics: Topic[];
  lastChange: PlanChange | null;
  masteryComplete: boolean;
  budgetCompressed: boolean;
  isUpdating: boolean;
  completeMasteryCheck: () => Promise<void>;
  compressBudget: () => Promise<void>;
  resetDemo: () => void;
  startFocus: () => void;
}

const DemoContext = createContext<DemoState | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [student, setStudent] = useState(demoStudent);
  const [plan, setPlan] = useState(defaultPlan);
  const [topics, setTopics] = useState(demoTopics);
  const [lastChange, setLastChange] = useState<PlanChange | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const masteryComplete =
    topics.find((topic) => topic.id === "cpu-scheduling")?.mastery === 72;
  const budgetCompressed = student.studyBudgetHours === 3;

  const completeMasteryCheck = useCallback(async () => {
    setIsUpdating(true);
    const result = await learningApi.submitMasteryCheck("cpu-scheduling");
    setTopics((current) =>
      current.map((topic) =>
        topic.id === result.topicId
          ? { ...topic, mastery: result.after, status: "developing" as const }
          : topic,
      ),
    );
    setPlan(result.plan);
    setLastChange(result.change);
    setIsUpdating(false);
  }, []);

  const compressBudget = useCallback(async () => {
    setIsUpdating(true);
    const result = await learningApi.updateTimeBudget(3);
    setStudent((current) => ({
      ...current,
      studyBudgetHours: result.currentHours,
    }));
    setPlan(result.plan);
    setLastChange(result.change);
    setIsUpdating(false);
  }, []);

  const resetDemo = useCallback(() => {
    setStudent(demoStudent);
    setPlan(defaultPlan);
    setTopics(demoTopics);
    setLastChange(null);
    router.push("/student");
  }, [router]);

  const startFocus = useCallback(() => router.push("/student/focus"), [router]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target;
      const isTyping =
        target instanceof Element &&
        target.matches("input, textarea, [contenteditable='true']");
      if (isTyping) return;
      if (event.key.toLowerCase() === "s" && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        startFocus();
      }
      if (event.key.toLowerCase() === "p" && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        router.push("/student/plan");
      }
      // Hidden demo reset: Ctrl/Cmd + Shift + R
      if (
        event.key.toLowerCase() === "r" &&
        event.shiftKey &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        resetDemo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router, startFocus, resetDemo]);

  // Support ?demo=riya URL param for deterministic demo reset
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("demo") === "riya") {
      resetDemo();
      // Clean the URL without reload
      const url = new URL(window.location.href);
      url.searchParams.delete("demo");
      window.history.replaceState({}, "", url.pathname);
    }
    // Run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      student,
      plan,
      topics,
      lastChange,
      masteryComplete,
      budgetCompressed,
      isUpdating,
      completeMasteryCheck,
      compressBudget,
      resetDemo,
      startFocus,
    }),
    [
      student,
      plan,
      topics,
      lastChange,
      masteryComplete,
      budgetCompressed,
      isUpdating,
      completeMasteryCheck,
      compressBudget,
      resetDemo,
      startFocus,
    ],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemo must be used within DemoProvider");
  return value;
}
