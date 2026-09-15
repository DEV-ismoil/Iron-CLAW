import React, { useCallback, useState } from "react";
import { View, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut, runOnJS } from "react-native-reanimated";
import { hapticSelect } from "@/utils/haptics";
import { GlassCard } from "@/components/glass/GlassCard";
import { YearHeatmap } from "@/components/calendar/YearHeatmap";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { DayDetail } from "@/components/calendar/DayDetail";
import { colors } from "@/theme/colors";
import type { HeatLevel } from "@/theme/colors";
import { todayKey } from "@/utils/date";
import type { CalendarZoom, WorkoutDay } from "@/types";

interface Props {
  heatLevelForDay: (key: string) => HeatLevel;
  getDay: (key: string) => WorkoutDay | undefined;
  volumeForDay: (key: string) => number;
}

export const WorkoutCalendar: React.FC<Props> = ({
  heatLevelForDay,
  getDay,
  volumeForDay,
}) => {
  const now = new Date();
  const [zoom, setZoom] = useState<CalendarZoom>("month");
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<string>(todayKey());

  const zoomIn = useCallback(() => {
    setZoom((z) => (z === "year" ? "month" : z === "month" ? "day" : "day"));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => (z === "day" ? "month" : z === "month" ? "year" : "year"));
  }, []);

  const buzz = useCallback(() => {
    hapticSelect();
  }, []);

  // Pinch: spread fingers apart (scale > 1) to zoom in a level,
  // pinch together (scale < 1) to zoom out a level. Apple Photos-style.
  const pinchGesture = Gesture.Pinch().onEnd((e) => {
    if (e.scale > 1.25) {
      runOnJS(buzz)();
      runOnJS(zoomIn)();
    } else if (e.scale < 0.8) {
      runOnJS(buzz)();
      runOnJS(zoomOut)();
    }
  });

  const handleSelectMonth = (m: number) => {
    setMonth(m);
    setZoom("month");
  };

  const handleSelectDay = (key: string) => {
    setSelectedDay(key);
    setZoom("day");
  };

  const handleChangeMonth = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setMonth(m);
    setYear(y);
  };

  return (
    <View>
      <View className="flex-row items-center justify-between px-1 mb-3">
        <Text style={{ color: colors.cyanSoft }} className="text-sm uppercase tracking-widest font-bold">
          {zoom === "year" ? "Year overview" : zoom === "month" ? "Month view" : "Day detail"}
        </Text>
        <Text style={{ color: colors.inkFaint }} className="text-xs italic">
          pinch to zoom
        </Text>
      </View>

      <GestureDetector gesture={pinchGesture}>
        <View
          style={{
            shadowColor: colors.cyan,
            shadowOpacity: 0.4,
            shadowRadius: 34,
            shadowOffset: { width: 0, height: 0 },
          }}
        >
          <GlassCard radius={32} intensity={46} style={{ padding: 18 }}>
            {zoom === "year" && (
              <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(120)}>
                <Text style={{ color: colors.ink }} className="text-2xl font-bold mb-4">
                  {year}
                </Text>
                <YearHeatmap
                  year={year}
                  heatLevelForDay={heatLevelForDay}
                  onSelectMonth={handleSelectMonth}
                />
              </Animated.View>
            )}

            {zoom === "month" && (
              <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(120)}>
                <MonthGrid
                  year={year}
                  month={month}
                  heatLevelForDay={heatLevelForDay}
                  onSelectDay={handleSelectDay}
                  onChangeMonth={handleChangeMonth}
                />
              </Animated.View>
            )}

            {zoom === "day" && (
              <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(120)}>
                <DayDetail
                  dateKey={selectedDay}
                  day={getDay(selectedDay)}
                  volume={volumeForDay(selectedDay)}
                  onBack={() => setZoom("month")}
                />
              </Animated.View>
            )}
          </GlassCard>
        </View>
      </GestureDetector>
    </View>
  );
};
