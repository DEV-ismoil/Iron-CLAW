import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GlassCard } from "@/components/glass/GlassCard";
import { GoalCard } from "@/components/goals/GoalCard";
import { AddGoalModal } from "@/components/goals/AddGoalModal";
import { useGoals } from "@/context/GoalsContext";
import { colors } from "@/theme/colors";
import { hapticTap } from "@/utils/haptics";

export const GoalsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { goals } = useGoals();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 6,
        paddingBottom: insets.bottom + 120,
      }}
    >
      <View className="flex-row items-center justify-between mb-1">
        <Text style={{ color: colors.ink }} className="text-4xl font-bold">
          Goals
        </Text>
        <Pressable
          onPress={() => {
            hapticTap();
            setModalOpen(true);
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.cyan,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="add" size={24} color="#04141A" />
        </Pressable>
      </View>
      <Text style={{ color: colors.inkFaint }} className="text-sm mb-5">
        Countdowns and workout targets
      </Text>

      {goals.length === 0 && (
        <GlassCard>
          <Text style={{ color: colors.inkFaint }} className="text-center py-4">
            No goals yet — tap + to set a countdown or a workout target.
          </Text>
        </GlassCard>
      )}

      {goals.map((g) => (
        <GoalCard key={g.id} goal={g} />
      ))}

      <AddGoalModal visible={modalOpen} onClose={() => setModalOpen(false)} />

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};
