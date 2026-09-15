import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Modal, Platform, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import DateTimePicker from "@react-native-community/datetimepicker";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { colors } from "@/theme/colors";
import { dateKey, addDays } from "@/utils/date";
import { useGoals } from "@/context/GoalsContext";
import { hapticTap } from "@/utils/haptics";
import type { GoalKind } from "@/types";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const AddGoalModal: React.FC<Props> = ({ visible, onClose }) => {
  const { addCountdownGoal, addWorkoutCountGoal } = useGoals();
  const [kind, setKind] = useState<GoalKind>("countdown");
  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState<Date>(addDays(new Date(), 30));
  const [targetCount, setTargetCount] = useState("12");
  const [useDeadline, setUseDeadline] = useState(false);

  const reset = () => {
    setTitle("");
    setKind("countdown");
    setTargetDate(addDays(new Date(), 30));
    setTargetCount("12");
    setUseDeadline(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = () => {
    if (!title.trim()) return;
    if (kind === "countdown") {
      addCountdownGoal(title, dateKey(targetDate));
    } else {
      const count = Number(targetCount) || 0;
      addWorkoutCountGoal(title, count, useDeadline ? dateKey(targetDate) : undefined);
    }
    handleClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFillObject} />
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(0,0,0,0.35)" }]} />
        <GlassCard radius={26} style={{ width: "100%" }}>
          <Text style={{ color: colors.ink }} className="text-lg font-bold mb-4">
            New Goal
          </Text>

          <View className="flex-row mb-4" style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 14, padding: 4 }}>
            {(
              [
                { key: "countdown" as GoalKind, label: "Countdown" },
                { key: "workoutCount" as GoalKind, label: "Workout Count" },
              ]
            ).map((opt) => (
              <Pressable
                key={opt.key}
                onPress={() => {
                  hapticTap();
                  setKind(opt.key);
                }}
                style={{
                  flex: 1,
                  paddingVertical: 9,
                  borderRadius: 11,
                  alignItems: "center",
                  backgroundColor: kind === opt.key ? colors.cyan : "transparent",
                }}
              >
                <Text
                  style={{
                    color: kind === opt.key ? "#04141A" : colors.inkDim,
                    fontWeight: "700",
                    fontSize: 13,
                  }}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder={kind === "countdown" ? "e.g. Beach Trip" : "e.g. Workouts this month"}
            placeholderTextColor={colors.inkFaint}
            style={{
              color: colors.ink,
              fontSize: 15,
              backgroundColor: "rgba(255,255,255,0.07)",
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 10,
              marginBottom: 14,
            }}
          />

          {kind === "countdown" && (
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: colors.inkFaint, fontSize: 12, marginBottom: 6 }}>
                Target date
              </Text>
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  alignItems: Platform.OS === "ios" ? "flex-start" : undefined,
                }}
              >
                <DateTimePicker
                  value={targetDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "compact" : "default"}
                  minimumDate={addDays(new Date(), 1)}
                  onChange={(_, d) => d && setTargetDate(d)}
                  themeVariant="dark"
                  accentColor={colors.cyan}
                  style={{ alignSelf: "flex-start", margin: 6 }}
                />
              </View>
            </View>
          )}

          {kind === "workoutCount" && (
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: colors.inkFaint, fontSize: 12, marginBottom: 6 }}>
                Target number of workouts
              </Text>
              <TextInput
                value={targetCount}
                onChangeText={(t) => setTargetCount(t.replace(/[^0-9]/g, ""))}
                keyboardType="number-pad"
                placeholder="12"
                placeholderTextColor={colors.inkFaint}
                style={{
                  color: colors.ink,
                  fontSize: 15,
                  backgroundColor: "rgba(255,255,255,0.07)",
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  marginBottom: 12,
                }}
              />

              <Pressable
                onPress={() => setUseDeadline((v) => !v)}
                className="flex-row items-center mb-2"
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    borderWidth: 1.5,
                    borderColor: "rgba(255,255,255,0.3)",
                    marginRight: 8,
                    backgroundColor: useDeadline ? colors.cyan : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {useDeadline && <Text style={{ color: "#04141A", fontSize: 12, fontWeight: "800" }}>✓</Text>}
                </View>
                <Text style={{ color: colors.inkDim, fontSize: 13 }}>Add a deadline</Text>
              </Pressable>

              {useDeadline && (
                <View style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12 }}>
                  <DateTimePicker
                    value={targetDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "compact" : "default"}
                    minimumDate={addDays(new Date(), 1)}
                    onChange={(_, d) => d && setTargetDate(d)}
                    themeVariant="dark"
                    accentColor={colors.cyan}
                    style={{ alignSelf: "flex-start", margin: 6 }}
                  />
                </View>
              )}
            </View>
          )}

          <View className="flex-row mt-4" style={{ gap: 10 }}>
            <GlassButton label="Cancel" variant="ghost" onPress={handleClose} style={{ flex: 1 }} />
            <GlassButton label="Save Goal" variant="solid" onPress={handleSave} style={{ flex: 1 }} />
          </View>
        </GlassCard>
      </View>
    </Modal>
  );
};
