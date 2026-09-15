import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WorkoutCalendar } from "@/components/calendar/WorkoutCalendar";
import { useWorkouts } from "@/context/WorkoutContext";
import { colors } from "@/theme/colors";
import { formatHeaderDate } from "@/utils/date";

export const CalendarScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { heatLevelForDay, getDay, volumeForDay } = useWorkouts();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 12,
        paddingTop: 6,
        paddingBottom: insets.bottom + 120,
      }}
    >
      <View style={{ paddingHorizontal: 4 }}>
        <Text style={{ color: colors.ink }} className="text-4xl font-bold mb-1">
          Calendar
        </Text>
        <Text style={{ color: colors.inkFaint }} className="text-sm mb-5">
          {formatHeaderDate(new Date())}
        </Text>
      </View>

      <WorkoutCalendar
        heatLevelForDay={heatLevelForDay}
        getDay={getDay}
        volumeForDay={volumeForDay}
      />

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};
