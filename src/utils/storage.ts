import AsyncStorage from "@react-native-async-storage/async-storage";
import type { WorkoutDay, WeightUnit, WorkoutPreset, Goal } from "@/types";

const WORKOUTS_KEY = "iron-paws:workouts:v1";
const UNIT_KEY = "iron-paws:unit:v1";
const PRESETS_KEY = "iron-paws:presets:v1";
const GOALS_KEY = "iron-paws:goals:v1";

const DEFAULT_PRESETS: WorkoutPreset[] = [
  { id: "preset-chest", name: "Chest Day", exerciseNames: ["Bench Press", "Incline Dumbbell Press", "Cable Fly", "Dips"] },
  { id: "preset-back", name: "Back Day", exerciseNames: ["Deadlift", "Pull-ups", "Barbell Row", "Lat Pulldown"] },
  { id: "preset-legs", name: "Leg Day", exerciseNames: ["Squat", "Leg Press", "Romanian Deadlift", "Calf Raise"] },
  { id: "preset-arms", name: "Arm Day", exerciseNames: ["Barbell Curl", "Skull Crushers", "Hammer Curl", "Tricep Pushdown"] },
  { id: "preset-shoulders", name: "Shoulder Day", exerciseNames: ["Overhead Press", "Lateral Raise", "Rear Delt Fly", "Shrugs"] },
];

export const loadWorkouts = async (): Promise<Record<string, WorkoutDay>> => {
  try {
    const raw = await AsyncStorage.getItem(WORKOUTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveWorkouts = async (
  workouts: Record<string, WorkoutDay>
): Promise<void> => {
  try {
    await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
  } catch {
    // Best-effort persistence — the in-memory state still works this session.
  }
};

export const loadUnit = async (): Promise<WeightUnit> => {
  try {
    const raw = await AsyncStorage.getItem(UNIT_KEY);
    return raw === "kg" ? "kg" : "lbs";
  } catch {
    return "lbs";
  }
};

export const saveUnit = async (unit: WeightUnit): Promise<void> => {
  try {
    await AsyncStorage.setItem(UNIT_KEY, unit);
  } catch {
    // ignore
  }
};

export const loadPresets = async (): Promise<WorkoutPreset[]> => {
  try {
    const raw = await AsyncStorage.getItem(PRESETS_KEY);
    if (!raw) {
      await AsyncStorage.setItem(PRESETS_KEY, JSON.stringify(DEFAULT_PRESETS));
      return DEFAULT_PRESETS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_PRESETS;
  } catch {
    return DEFAULT_PRESETS;
  }
};

export const savePresets = async (presets: WorkoutPreset[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
  } catch {
    // ignore
  }
};

export const loadGoals = async (): Promise<Goal[]> => {
  try {
    const raw = await AsyncStorage.getItem(GOALS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveGoals = async (goals: Goal[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  } catch {
    // ignore
  }
};
