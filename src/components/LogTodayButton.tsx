import React, { useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import { hapticCelebrate } from "@/utils/haptics";

interface Props {
  logged: boolean;
  onPress: () => void;
}

export const LogTodayButton: React.FC<Props> = ({ logged, onPress }) => {
  const glow = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (logged) {
      glow.value = withSequence(
        withTiming(1, { duration: 220, easing: Easing.out(Easing.quad) }),
        withTiming(0.55, { duration: 500 })
      );
      scale.value = withSequence(
        withTiming(1.04, { duration: 150 }),
        withTiming(1, { duration: 200 })
      );
    }
  }, [logged]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));
  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (logged) return;
    hapticCelebrate();
    onPress();
  };

  return (
    <Animated.View style={scaleStyle}>
      <Pressable onPress={handlePress} disabled={logged}>
        <Animated.View style={[styles.glowRing, glowStyle]} />
        <LinearGradient
          colors={
            logged
              ? [colors.emerald, colors.emerald]
              : [colors.cyan, colors.emerald]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.label}>
            {logged ? "Session logged ✓" : "Log Today's Session"}
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.emerald,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  glowRing: {
    position: "absolute",
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 28,
    backgroundColor: colors.emeraldDim,
  },
  label: {
    color: "#04141A",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
