import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { GlassCard } from "@/components/glass/GlassCard";
import { SetRow } from "@/components/tracker/SetRow";
import { colors } from "@/theme/colors";
import { hapticTap } from "@/utils/haptics";
import type { ExerciseBlock, SetEntry } from "@/types";

interface Props {
  exercise: ExerciseBlock;
  expanded: boolean;
  onToggleExpanded: () => void;
  onAddSet: () => void;
  onUpdateSet: (
    setId: string,
    patch: Partial<Pick<SetEntry, "weight" | "reps" | "completed" | "unit">>
  ) => void;
  onRemoveSet: (setId: string) => void;
  onRemoveExercise: () => void;
}

export const ExerciseCard: React.FC<Props> = ({
  exercise,
  expanded,
  onToggleExpanded,
  onAddSet,
  onUpdateSet,
  onRemoveSet,
  onRemoveExercise,
}) => {
  const completedSets = exercise.sets.filter((s) => s.completed).length;

  const handleToggle = () => {
    hapticTap();
    onToggleExpanded();
  };

  return (
    <GlassCard style={{ marginBottom: 10 }}>
      <Pressable onPress={handleToggle}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 pr-2">
            <Ionicons
              name={expanded ? "chevron-down" : "chevron-forward"}
              size={16}
              color={colors.inkFaint}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{ color: colors.ink }}
              className="text-[16px] font-semibold flex-1"
              numberOfLines={1}
            >
              {exercise.name}
            </Text>
          </View>
          <Text style={{ color: colors.inkFaint, fontSize: 12 }}>
            {completedSets}/{exercise.sets.length}
          </Text>
          <Pressable onPress={onRemoveExercise} hitSlop={8} style={{ marginLeft: 12 }}>
            <Ionicons name="trash-outline" size={16} color={colors.inkFaint} />
          </Pressable>
        </View>
      </Pressable>

      {expanded && (
        <Animated.View entering={FadeIn.duration(140)} exiting={FadeOut.duration(100)}>
          {exercise.sets.map((s) => (
            <SetRow
              key={s.id}
              set={s}
              onChange={(patch) => onUpdateSet(s.id, patch)}
              onRemove={() => onRemoveSet(s.id)}
            />
          ))}

          <Pressable onPress={onAddSet} style={{ marginTop: 10, alignSelf: "flex-start" }}>
            <Text style={{ color: colors.cyanSoft, fontWeight: "600", fontSize: 13 }}>
              + Add set
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </GlassCard>
  );
};
