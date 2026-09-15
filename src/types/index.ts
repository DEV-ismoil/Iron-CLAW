export type WeightUnit = "lbs" | "kg";

export interface SetEntry {
  id: string;
  index: number; // auto-incrementing set number within its exercise
  weight: number;
  unit: WeightUnit;
  reps: number;
  completed: boolean;
}

export interface ExerciseBlock {
  id: string;
  name: string;
  sets: SetEntry[];
}

// One calendar day's logged workout
export interface WorkoutDay {
  dateKey: string; // "YYYY-MM-DD"
  exercises: ExerciseBlock[];
  completedAt: string; // ISO timestamp of when the day was marked logged
}

export type MascotState = "resting" | "pulsing" | "celebrating";

export type CalendarZoom = "year" | "month" | "day";

export type TabKey = "calendar" | "workout" | "goals";

// A saved routine template (e.g. "Chest Day") — just exercise names;
// applying one drops fresh empty sets into today's tracker, Strong-app style.
export interface WorkoutPreset {
  id: string;
  name: string;
  exerciseNames: string[];
}

export type GoalKind = "countdown" | "workoutCount";

export interface Goal {
  id: string;
  title: string;
  kind: GoalKind;
  // "countdown": counts down to this date.
  // "workoutCount": optional deadline; omit for an open-ended target.
  targetDate?: string; // "YYYY-MM-DD"
  // "workoutCount": how many logged workout days to reach.
  targetCount?: number;
  // "workoutCount": only days on/after this count toward the goal.
  startDate: string; // "YYYY-MM-DD"
  createdAt: string; // ISO timestamp
}
