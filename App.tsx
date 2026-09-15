import "./global.css";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { WorkoutProvider, useWorkouts } from "@/context/WorkoutContext";
import { GoalsProvider } from "@/context/GoalsContext";
import { TopBar } from "@/components/TopBar";
import { CalendarScreen } from "@/screens/CalendarScreen";
import { WorkoutScreen } from "@/screens/WorkoutScreen";
import { GoalsScreen } from "@/screens/GoalsScreen";
import { WorkoutTimer } from "@/components/timer/WorkoutTimer";
import { GlassTabBar } from "@/navigation/GlassTabBar";
import { colors } from "@/theme/colors";
import type { MascotState, TabKey } from "@/types";

const AppContent: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { ready, streak, logToday } = useWorkouts();

  const [tab, setTab] = useState<TabKey>("workout");
  const [timerRunning, setTimerRunning] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  const handleLogToday = useCallback(() => {
    logToday();
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 1500);
  }, [logToday]);

  const mascotState: MascotState = celebrating
    ? "celebrating"
    : timerRunning
    ? "pulsing"
    : "resting";

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: colors.void }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.void }}>
      <StatusBar style="light" />

      <View style={{ paddingTop: insets.top }}>
        <TopBar streak={streak} mascotState={mascotState} />
      </View>

      <View style={{ flex: 1 }}>
        {tab === "calendar" && <CalendarScreen />}
        {tab === "workout" && <WorkoutScreen onLogToday={handleLogToday} />}
        {tab === "goals" && <GoalsScreen />}
      </View>

      {/* Fixed independently of any scroll content — see WorkoutTimer for why. */}
      <WorkoutTimer onRunningChange={setTimerRunning} />

      <GlassTabBar active={tab} onChange={setTab} />
    </View>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LinearGradient
          colors={[colors.void, colors.void200, colors.void]}
          style={{ flex: 1 }}
        >
          <WorkoutProvider>
            <GoalsProvider>
              <AppContent />
            </GoalsProvider>
          </WorkoutProvider>
        </LinearGradient>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
