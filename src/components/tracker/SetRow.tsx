import React from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors } from "@/theme/colors";
import { hapticSelect } from "@/utils/haptics";
import type { SetEntry, WeightUnit } from "@/types";

interface Props {
  set: SetEntry;
  onChange: (patch: Partial<Pick<SetEntry, "weight" | "reps" | "completed" | "unit">>) => void;
  onRemove: () => void;
}

export const SetRow: React.FC<Props> = ({ set, onChange, onRemove }) => {
  const checkScale = useSharedValue(1);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const toggleComplete = () => {
    hapticSelect();
    checkScale.value = withTiming(1.25, { duration: 90 }, () => {
      checkScale.value = withTiming(1, { duration: 140 });
    });
    onChange({ completed: !set.completed });
  };

  const toggleUnit = () => {
    const next: WeightUnit = set.unit === "lbs" ? "kg" : "lbs";
    onChange({ unit: next });
  };

  return (
    <View style={styles.row}>
      <Text style={[styles.setNum, { color: colors.inkFaint }]}>{set.index}</Text>

      <View style={styles.weightWrap}>
        <TextInput
          value={set.weight === 0 ? "" : String(set.weight)}
          onChangeText={(t) => onChange({ weight: Number(t.replace(/[^0-9.]/g, "")) || 0 })}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={colors.inkFaint}
          style={styles.input}
        />
        <Pressable onPress={toggleUnit} style={styles.unitPill}>
          <Text style={styles.unitLabel}>{set.unit}</Text>
        </Pressable>
      </View>

      <TextInput
        value={set.reps === 0 ? "" : String(set.reps)}
        onChangeText={(t) => onChange({ reps: Number(t.replace(/[^0-9]/g, "")) || 0 })}
        keyboardType="number-pad"
        placeholder="0"
        placeholderTextColor={colors.inkFaint}
        style={[styles.input, styles.repsInput]}
      />

      <Pressable onPress={toggleComplete} hitSlop={8}>
        <Animated.View
          style={[
            styles.check,
            checkStyle,
            set.completed && { backgroundColor: colors.emerald, borderColor: colors.emerald },
          ]}
        >
          {set.completed && <Text style={styles.checkMark}>✓</Text>}
        </Animated.View>
      </Pressable>

      <Pressable onPress={onRemove} hitSlop={8} style={{ marginLeft: 6 }}>
        <Text style={{ color: colors.inkFaint, fontSize: 16 }}>×</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  setNum: {
    width: 20,
    fontSize: 13,
    fontWeight: "600",
  },
  weightWrap: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1.3,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 10,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  input: {
    color: colors.ink,
    fontSize: 15,
    paddingVertical: 8,
    minWidth: 36,
    flex: 1,
  },
  repsInput: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 8,
    textAlign: "center",
  },
  unitPill: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "rgba(63,224,255,0.16)",
  },
  unitLabel: {
    color: colors.cyanSoft,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: {
    color: "#04141A",
    fontWeight: "800",
    fontSize: 14,
  },
});
