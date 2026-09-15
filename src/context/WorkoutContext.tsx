import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import type {
  ExerciseBlock,
  SetEntry,
  WeightUnit,
  WorkoutDay,
  WorkoutPreset,
} from "@/types";
import type { HeatLevel } from "@/theme/colors";
import { todayKey, computeStreak } from "@/utils/date";
import {
  loadWorkouts,
  saveWorkouts,
  loadUnit,
  saveUnit,
  loadPresets,
  savePresets,
} from "@/utils/storage";

interface WorkoutContextValue {
  ready: boolean;
  workouts: Record<string, WorkoutDay>;
  unit: WeightUnit;
  setUnit: (u: WeightUnit) => void;
  streak: number;

  // Today's draft — what the Set Tracker section edits directly.
  todaysExercises: ExerciseBlock[];
  addExercise: (name: string) => void;
  removeExercise: (exerciseId: string) => void;
  addSet: (exerciseId: string) => void;
  updateSet: (
    exerciseId: string,
    setId: string,
    patch: Partial<Pick<SetEntry, "weight" | "reps" | "completed" | "unit">>
  ) => void;
  removeSet: (exerciseId: string, setId: string) => void;

  isTodayLogged: boolean;
  logToday: () => void;

  getDay: (key: string) => WorkoutDay | undefined;
  volumeForDay: (key: string) => number;
  heatLevelForDay: (key: string) => HeatLevel;
  loggedDateKeys: Set<string>;

  presets: WorkoutPreset[];
  applyPreset: (presetId: string) => void;
  addPreset: (name: string, exerciseNames: string[]) => void;
  deletePreset: (presetId: string) => void;
}

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);

const emptyDay = (key: string): WorkoutDay => ({
  dateKey: key,
  exercises: [],
  completedAt: "",
});

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [ready, setReady] = useState(false);
  const [workouts, setWorkouts] = useState<Record<string, WorkoutDay>>({});
  const [unit, setUnitState] = useState<WeightUnit>("lbs");
  const [presets, setPresets] = useState<WorkoutPreset[]>([]);
  const hydrated = useRef(false);
  const presetsHydrated = useRef(false);

  useEffect(() => {
    (async () => {
      const [w, u, p] = await Promise.all([loadWorkouts(), loadUnit(), loadPresets()]);
      setWorkouts(w);
      setUnitState(u);
      setPresets(p);
      hydrated.current = true;
      presetsHydrated.current = true;
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!presetsHydrated.current) return;
    savePresets(presets);
  }, [presets]);

  // Persist whenever workouts change, but skip the very first (pre-hydration) render.
  useEffect(() => {
    if (!hydrated.current) return;
    saveWorkouts(workouts);
  }, [workouts]);

  const setUnit = useCallback((u: WeightUnit) => {
    setUnitState(u);
    saveUnit(u);
  }, []);

  const mutateToday = useCallback(
    (fn: (day: WorkoutDay) => WorkoutDay) => {
      const key = todayKey();
      setWorkouts((prev) => {
        const current = prev[key] ?? emptyDay(key);
        return { ...prev, [key]: fn(current) };
      });
    },
    []
  );

  const addExercise = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      mutateToday((day) => ({
        ...day,
        exercises: [
          ...day.exercises,
          { id: uid(), name: trimmed, sets: [] },
        ],
      }));
    },
    [mutateToday]
  );

  const removeExercise = useCallback(
    (exerciseId: string) => {
      mutateToday((day) => ({
        ...day,
        exercises: day.exercises.filter((e) => e.id !== exerciseId),
      }));
    },
    [mutateToday]
  );

  const addSet = useCallback(
    (exerciseId: string) => {
      mutateToday((day) => ({
        ...day,
        exercises: day.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          const last = ex.sets[ex.sets.length - 1];
          const newSet: SetEntry = {
            id: uid(),
            index: ex.sets.length + 1,
            weight: last?.weight ?? 0,
            unit,
            reps: last?.reps ?? 0,
            completed: false,
          };
          return { ...ex, sets: [...ex.sets, newSet] };
        }),
      }));
    },
    [mutateToday, unit]
  );

  const updateSet = useCallback(
    (
      exerciseId: string,
      setId: string,
      patch: Partial<Pick<SetEntry, "weight" | "reps" | "completed" | "unit">>
    ) => {
      mutateToday((day) => ({
        ...day,
        exercises: day.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          return {
            ...ex,
            sets: ex.sets.map((s) => (s.id === setId ? { ...s, ...patch } : s)),
          };
        }),
      }));
    },
    [mutateToday]
  );

  const removeSet = useCallback(
    (exerciseId: string, setId: string) => {
      mutateToday((day) => ({
        ...day,
        exercises: day.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          const remaining = ex.sets
            .filter((s) => s.id !== setId)
            .map((s, i) => ({ ...s, index: i + 1 }));
          return { ...ex, sets: remaining };
        }),
      }));
    },
    [mutateToday]
  );

  const logToday = useCallback(() => {
    mutateToday((day) => ({ ...day, completedAt: new Date().toISOString() }));
  }, [mutateToday]);

  const applyPreset = useCallback(
    (presetId: string) => {
      const preset = presets.find((p) => p.id === presetId);
      if (!preset) return;
      mutateToday((day) => ({
        ...day,
        exercises: [
          ...day.exercises,
          ...preset.exerciseNames.map((name) => ({
            id: uid(),
            name,
            // Three empty sets ready to fill in — mirrors starting a Strong template.
            sets: Array.from({ length: 3 }, (_, i) => ({
              id: uid(),
              index: i + 1,
              weight: 0,
              unit,
              reps: 0,
              completed: false,
            })),
          })),
        ],
      }));
    },
    [mutateToday, presets, unit]
  );

  const addPreset = useCallback((name: string, exerciseNames: string[]) => {
    const trimmed = name.trim();
    if (!trimmed || exerciseNames.length === 0) return;
    setPresets((prev) => [
      ...prev,
      { id: uid(), name: trimmed, exerciseNames },
    ]);
  }, []);

  const deletePreset = useCallback((presetId: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== presetId));
  }, []);

  const getDay = useCallback((key: string) => workouts[key], [workouts]);

  const volumeForDay = useCallback(
    (key: string) => {
      const day = workouts[key];
      if (!day) return 0;
      return day.exercises.reduce(
        (sum, ex) =>
          sum +
          ex.sets.reduce(
            (s, set) => s + (set.completed ? set.weight * set.reps : 0),
            0
          ),
        0
      );
    },
    [workouts]
  );

  const heatLevelForDay = useCallback(
    (key: string): HeatLevel => {
      const day = workouts[key];
      if (!day) return 0;
      const totalSets = day.exercises.reduce(
        (n, ex) => n + ex.sets.filter((s) => s.completed).length,
        0
      );
      const hasAnySignal = Boolean(day.completedAt) || totalSets > 0;
      if (!hasAnySignal) return 0;
      if (totalSets >= 15) return 4;
      if (totalSets >= 9) return 3;
      if (totalSets >= 3) return 2;
      // Any logged/completed day still lights up, even with just one set
      // (or a bare "Log Today" tap and no tracked sets).
      return 1;
    },
    [workouts]
  );

  const loggedDateKeys = useMemo(() => {
    const set = new Set<string>();
    Object.values(workouts).forEach((d) => {
      if (d.completedAt) set.add(d.dateKey);
    });
    return set;
  }, [workouts]);

  const streak = useMemo(() => computeStreak(loggedDateKeys), [loggedDateKeys]);

  const todaysExercises = workouts[todayKey()]?.exercises ?? [];
  const isTodayLogged = Boolean(workouts[todayKey()]?.completedAt);

  const value: WorkoutContextValue = {
    ready,
    workouts,
    unit,
    setUnit,
    streak,
    todaysExercises,
    addExercise,
    removeExercise,
    addSet,
    updateSet,
    removeSet,
    isTodayLogged,
    logToday,
    getDay,
    volumeForDay,
    heatLevelForDay,
    loggedDateKeys,
    presets,
    applyPreset,
    addPreset,
    deletePreset,
  };

  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
};

export const useWorkouts = (): WorkoutContextValue => {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error("useWorkouts must be used within WorkoutProvider");
  return ctx;
};
