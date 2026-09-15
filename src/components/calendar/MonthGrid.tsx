import React, { useEffect, useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import {
  daysInMonth,
  firstWeekdayOfMonth,
  dateKey,
  keyToDate,
  todayKey,
  monthLabel,
} from "@/utils/date";
import { heatColor, colors } from "@/theme/colors";
import type { HeatLevel } from "@/theme/colors";
import { GlassButton } from "@/components/glass/GlassButton";

interface Props {
  year: number;
  month: number; // 0-11
  heatLevelForDay: (key: string) => HeatLevel;
  onSelectDay: (key: string) => void;
  onChangeMonth: (delta: number) => void;
}

const WEEKDAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

// A slow, glowing pulse ring that marks "today" — makes the grid feel alive
// rather than a static screenshot.
const TodayPulse: React.FC = () => {
  const pulse = useSharedValue(0.5);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.5, { duration: 900, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [pulse]);

  const style = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          top: -3,
          left: -3,
          right: -3,
          bottom: -3,
          borderRadius: 18,
          borderWidth: 2,
          borderColor: colors.cyan,
        },
        style,
      ]}
    />
  );
};

export const MonthGrid: React.FC<Props> = ({
  year,
  month,
  heatLevelForDay,
  onSelectDay,
  onChangeMonth,
}) => {
  const today = todayKey();

  const cells = useMemo(() => {
    const total = daysInMonth(year, month);
    const startPad = firstWeekdayOfMonth(year, month);
    const arr: (string | null)[] = new Array(startPad).fill(null);
    for (let d = 1; d <= total; d++) {
      arr.push(dateKey(new Date(year, month, d)));
    }
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [year, month]);

  return (
    <View>
      <View className="flex-row items-center justify-between mb-4">
        <GlassButton
          label="‹"
          compact
          variant="ghost"
          onPress={() => onChangeMonth(-1)}
          style={{ minWidth: 44 }}
        />
        <Text style={{ color: colors.ink }} className="text-xl font-bold">
          {monthLabel(year, month)}
        </Text>
        <GlassButton
          label="›"
          compact
          variant="ghost"
          onPress={() => onChangeMonth(1)}
          style={{ minWidth: 44 }}
        />
      </View>

      <View className="flex-row mb-2">
        {WEEKDAY_LETTERS.map((w, i) => (
          <View key={i} style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ color: colors.inkDim, fontSize: 13, fontWeight: "700" }}>{w}</Text>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {cells.map((key, i) => {
          if (!key) {
            return <View key={i} style={{ width: `${100 / 7}%`, aspectRatio: 1 }} />;
          }
          const level = heatLevelForDay(key);
          const isToday = key === today;
          const dayNum = keyToDate(key).getDate();
          return (
            <View key={i} style={{ width: `${100 / 7}%`, aspectRatio: 1, padding: 4 }}>
              <Pressable
                onPress={() => onSelectDay(key)}
                style={{
                  flex: 1,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: level > 0 ? heatColor(level) : "rgba(255,255,255,0.05)",
                  borderWidth: level > 0 ? 1.5 : 0,
                  borderColor: level >= 3 ? colors.emerald : colors.cyan,
                  shadowColor: level >= 3 ? colors.emerald : colors.cyan,
                  shadowOpacity: level >= 2 ? 0.85 : 0,
                  shadowRadius: level >= 3 ? 10 : 7,
                  shadowOffset: { width: 0, height: 0 },
                }}
              >
                {isToday && <TodayPulse />}
                <Text
                  style={{
                    color: level >= 2 ? "#04141A" : colors.ink,
                    fontWeight: isToday ? "800" : "500",
                    fontSize: 16,
                  }}
                >
                  {dayNum}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};
