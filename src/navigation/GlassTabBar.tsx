import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";
import { hapticTap } from "@/utils/haptics";
import type { TabKey } from "@/types";

interface TabDef {
  key: TabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
}

const TABS: TabDef[] = [
  { key: "calendar", label: "Calendar", icon: "calendar-outline", iconActive: "calendar" },
  { key: "workout", label: "Workout", icon: "barbell-outline", iconActive: "barbell" },
  { key: "goals", label: "Goals", icon: "flag-outline", iconActive: "flag" },
];

interface TabButtonProps {
  tab: TabDef;
  active: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ tab, active, onPress }) => {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    hapticTap();
    scale.value = withTiming(0.88, { duration: 80 }, () => {
      scale.value = withTiming(1, { duration: 140 });
    });
    onPress();
  };

  const tint = active ? colors.cyan : colors.inkFaint;

  return (
    <Pressable onPress={handlePress} style={styles.tabBtn} hitSlop={8}>
      <Animated.View style={[style, { alignItems: "center" }]}>
        <Ionicons name={active ? tab.iconActive : tab.icon} size={24} color={tint} />
        <Text style={[styles.label, { color: tint, fontWeight: active ? "700" : "500" }]}>
          {tab.label}
        </Text>
        {active && <View style={styles.activeDot} />}
      </Animated.View>
    </Pressable>
  );
};

interface Props {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export const GlassTabBar: React.FC<Props> = ({ active, onChange }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFillObject} />
      <View style={styles.tint} />
      <View style={styles.hairline} />
      <View style={styles.row}>
        {TABS.map((t) => (
          <TabButton
            key={t.key}
            tab={t}
            active={active === t.key}
            onPress={() => onChange(t.key)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 10,
    overflow: "hidden",
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,11,13,0.55)",
  },
  hairline: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  row: {
    flexDirection: "row",
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  label: {
    fontSize: 11,
    marginTop: 3,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.cyan,
    marginTop: 4,
  },
});
