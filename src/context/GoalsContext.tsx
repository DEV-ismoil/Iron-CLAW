import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Goal } from "@/types";
import { loadGoals, saveGoals } from "@/utils/storage";
import { useWorkouts } from "@/context/WorkoutContext";
import { todayKey, dateKey, addDays } from "@/utils/date";

const uid = () => Math.random().toString(36).slice(2, 10);

export interface GoalProgress {
  // Countdown goals
  daysRemaining?: number;
  isPast?: boolean;
  // Workout-count goals
  loggedCount?: number;
  fraction: number; // 0-1, clamped
}

interface GoalsContextValue {
  ready: boolean;
  goals: Goal[];
  addCountdownGoal: (title: string, targetDate: string) => void;
  addWorkoutCountGoal: (
    title: string,
    targetCount: number,
    targetDate?: string
  ) => void;
  deleteGoal: (id: string) => void;
  progressForGoal: (goal: Goal) => GoalProgress;
}

const GoalsContext = createContext<GoalsContextValue | null>(null);

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { loggedDateKeys } = useWorkouts();
  const [ready, setReady] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const hydrated = useRef(false);

  useEffect(() => {
    (async () => {
      const g = await loadGoals();
      setGoals(g);
      hydrated.current = true;
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    saveGoals(goals);
  }, [goals]);

  const addCountdownGoal = useCallback((title: string, targetDate: string) => {
    const trimmed = title.trim();
    if (!trimmed || !targetDate) return;
    setGoals((prev) => [
      ...prev,
      {
        id: uid(),
        title: trimmed,
        kind: "countdown",
        targetDate,
        startDate: todayKey(),
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const addWorkoutCountGoal = useCallback(
    (title: string, targetCount: number, targetDate?: string) => {
      const trimmed = title.trim();
      if (!trimmed || !targetCount || targetCount <= 0) return;
      setGoals((prev) => [
        ...prev,
        {
          id: uid(),
          title: trimmed,
          kind: "workoutCount",
          targetCount,
          targetDate,
          startDate: todayKey(),
          createdAt: new Date().toISOString(),
        },
      ]);
    },
    []
  );

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const progressForGoal = useCallback(
    (goal: Goal): GoalProgress => {
      if (goal.kind === "countdown" && goal.targetDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const target = new Date(goal.targetDate + "T00:00:00");
        const msPerDay = 1000 * 60 * 60 * 24;
        const daysRemaining = Math.round((target.getTime() - today.getTime()) / msPerDay);
        const totalSpan = Math.max(
          1,
          Math.round(
            (target.getTime() - new Date(goal.startDate + "T00:00:00").getTime()) / msPerDay
          )
        );
        const elapsed = totalSpan - Math.max(0, daysRemaining);
        return {
          daysRemaining,
          isPast: daysRemaining < 0,
          fraction: Math.min(1, Math.max(0, elapsed / totalSpan)),
        };
      }

      // workoutCount
      let cursor = goal.startDate;
      const today = todayKey();
      let loggedCount = 0;
      // Walk day by day from startDate to today counting logged days —
      // ranges here are always small (a goal is realistically weeks/months).
      let safety = 0;
      while (cursor <= today && safety < 3660) {
        if (loggedDateKeys.has(cursor)) loggedCount += 1;
        cursor = dateKey(addDays(new Date(cursor + "T00:00:00"), 1));
        safety += 1;
      }
      const target = goal.targetCount ?? 1;
      return {
        loggedCount,
        fraction: Math.min(1, loggedCount / target),
      };
    },
    [loggedDateKeys]
  );

  const value: GoalsContextValue = {
    ready,
    goals,
    addCountdownGoal,
    addWorkoutCountGoal,
    deleteGoal,
    progressForGoal,
  };

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
};

export const useGoals = (): GoalsContextValue => {
  const ctx = useContext(GoalsContext);
  if (!ctx) throw new Error("useGoals must be used within GoalsProvider");
  return ctx;
};
