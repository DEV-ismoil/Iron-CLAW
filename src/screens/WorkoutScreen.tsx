import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WorkoutPresets } from "@/components/tracker/WorkoutPresets";
import { WorkoutTracker } from "@/components/tracker/WorkoutTracker";
import { LogTodayButton } from "@/components/LogTodayButton";
import { useWorkouts } from "@/context/WorkoutContext";
import { colors } from "@/theme/colors";
import { formatHeaderDate } from "@/utils/date";

interface Props {
  onLogToday: () => void;
}

export const WorkoutScreen: React.FC<Props> = ({ onLogToday }) => {
  const insets = useSafeAreaInsets();
  const { isTodayLogged } = useWorkouts();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 6,
        paddingBottom: insets.bottom + 120,
      }}
    >
      <Text style={{ color: colors.ink }} className="text-4xl font-bold mb-1">
        Workout
      </Text>
      <Text style={{ color: colors.inkFaint }} className="text-sm mb-5">
        {formatHeaderDate(new Date())}
      </Text>

      <View style={{ marginBottom: 20 }}>
        <LogTodayButton logged={isTodayLogged} onPress={onLogToday} />
      </View>

      <WorkoutPresets />

      <WorkoutTracker />

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};
