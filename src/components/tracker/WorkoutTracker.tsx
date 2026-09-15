import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { ExerciseCard } from "@/components/tracker/ExerciseCard";
import { GlassCard } from "@/components/glass/GlassCard";
import { colors } from "@/theme/colors";
import { useWorkouts } from "@/context/WorkoutContext";

const QUICK_ADD = ["Bench Press", "Squat", "Deadlift", "Pull-ups", "OHP"];

export const WorkoutTracker: React.FC = () => {
  const {
    todaysExercises,
    addExercise,
    removeExercise,
    addSet,
    updateSet,
    removeSet,
  } = useWorkouts();
  const [draft, setDraft] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const prevCount = useRef(todaysExercises.length);

  // Accordion: only one exercise's sets show at a time so a long workout
  // doesn't turn into an endless scroll — the newest addition auto-expands.
  useEffect(() => {
    if (todaysExercises.length > prevCount.current) {
      const last = todaysExercises[todaysExercises.length - 1];
      if (last) setExpandedId(last.id);
    }
    prevCount.current = todaysExercises.length;
  }, [todaysExercises]);

  const submit = () => {
    if (!draft.trim()) return;
    addExercise(draft);
    setDraft("");
  };

  return (
    <View>
      <Text style={{ color: colors.ink }} className="text-lg font-bold mb-3">
        Exercises
      </Text>

      <GlassCard style={{ marginBottom: 12 }}>
        <View className="flex-row items-center">
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Add an exercise…"
            placeholderTextColor={colors.inkFaint}
            style={{ flex: 1, color: colors.ink, fontSize: 15, paddingVertical: 6 }}
            onSubmitEditing={submit}
            returnKeyType="done"
          />
          <Pressable onPress={submit} hitSlop={8}>
            <Text style={{ color: colors.cyanSoft, fontWeight: "700", fontSize: 20 }}>+</Text>
          </Pressable>
        </View>
        <View className="flex-row flex-wrap mt-3" style={{ gap: 8 }}>
          {QUICK_ADD.map((name) => (
            <Pressable
              key={name}
              onPress={() => addExercise(name)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 10,
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            >
              <Text style={{ color: colors.inkDim, fontSize: 12 }}>{name}</Text>
            </Pressable>
          ))}
        </View>
      </GlassCard>

      {todaysExercises.length === 0 && (
        <GlassCard>
          <Text style={{ color: colors.inkFaint }} className="text-center py-2">
            No exercises yet — add your first one above.
          </Text>
        </GlassCard>
      )}

      {todaysExercises.map((ex) => (
        <ExerciseCard
          key={ex.id}
          exercise={ex}
          expanded={expandedId === ex.id}
          onToggleExpanded={() =>
            setExpandedId((cur) => (cur === ex.id ? null : ex.id))
          }
          onAddSet={() => addSet(ex.id)}
          onUpdateSet={(setId, patch) => updateSet(ex.id, setId, patch)}
          onRemoveSet={(setId) => removeSet(ex.id, setId)}
          onRemoveExercise={() => removeExercise(ex.id)}
        />
      ))}
    </View>
  );
};
