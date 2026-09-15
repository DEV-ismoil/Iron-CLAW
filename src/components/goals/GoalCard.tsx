import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { GlassCard } from "@/components/glass/GlassCard";
import { colors } from "@/theme/colors";
import { useGoals } from "@/context/GoalsContext";
import { formatDayLong } from "@/utils/date";
import type { Goal } from "@/types";

interface Props {
  goal: Goal;
}

export const GoalCard: React.FC<Props> = ({ goal }) => {
  const { progressForGoal, deleteGoal } = useGoals();
  const progress = progressForGoal(goal);

  const confirmDelete = () => {
    Alert.alert(`Delete "${goal.title}"?`, undefined, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteGoal(goal.id) },
    ]);
  };

  const isCountdown = goal.kind === "countdown";
  const daysRemaining = progress.daysRemaining ?? 0;

  return (
    <GlassCard style={{ marginBottom: 12 }}>
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-center flex-1 pr-2">
          <Ionicons
            name={isCountdown ? "hourglass-outline" : "flag-outline"}
            size={16}
            color={colors.cyanSoft}
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: colors.ink, fontWeight: "700", fontSize: 15 }} numberOfLines={1}>
            {goal.title}
          </Text>
        </View>
        <Pressable onPress={confirmDelete} hitSlop={8}>
          <Ionicons name="trash-outline" size={16} color={colors.inkFaint} />
        </Pressable>
      </View>

      {isCountdown ? (
        <>
          <Text style={{ color: progress.isPast ? colors.inkFaint : colors.emerald }} className="text-3xl font-extrabold">
            {progress.isPast ? "Passed" : daysRemaining === 0 ? "Today!" : Math.abs(daysRemaining)}
          </Text>
          {!progress.isPast && daysRemaining > 0 && (
            <Text style={{ color: colors.inkFaint, fontSize: 12 }}>days to go · {formatDayLong(goal.targetDate!)}</Text>
          )}
        </>
      ) : (
        <>
          <Text style={{ color: colors.emerald }} className="text-3xl font-extrabold">
            {progress.loggedCount}
            <Text style={{ color: colors.inkFaint, fontSize: 18 }}> / {goal.targetCount}</Text>
          </Text>
          <Text style={{ color: colors.inkFaint, fontSize: 12 }}>
            workouts logged{goal.targetDate ? ` · by ${formatDayLong(goal.targetDate)}` : ""}
          </Text>
        </>
      )}

      <View
        style={{
          height: 8,
          borderRadius: 4,
          backgroundColor: "rgba(255,255,255,0.08)",
          marginTop: 10,
          overflow: "hidden",
        }}
      >
        <LinearGradient
          colors={[colors.cyan, colors.emerald]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: "100%",
            width: `${Math.round(progress.fraction * 100)}%`,
            borderRadius: 4,
          }}
        />
      </View>
    </GlassCard>
  );
};
