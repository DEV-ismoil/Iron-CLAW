import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import { hapticTap } from "@/utils/haptics";

type Variant = "solid" | "glass" | "ghost";

interface GlassButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;
  compact?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const GlassButton: React.FC<GlassButtonProps> = ({
  label,
  onPress,
  variant = "glass",
  disabled = false,
  style,
  compact = false,
}) => {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.96, { duration: 90 });
  };
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 140 });
  };
  const handlePress = () => {
    if (disabled) return;
    hapticTap();
    onPress();
  };

  const paddingStyle = compact
    ? { paddingVertical: 10, paddingHorizontal: 16 }
    : { paddingVertical: 15, paddingHorizontal: 22 };

  if (variant === "solid") {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[animStyle, style, disabled && styles.disabled]}
      >
        <LinearGradient
          colors={[colors.cyan, colors.emerald]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.solidBase, paddingStyle]}
        >
          <Text style={styles.solidLabel}>{label}</Text>
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        animStyle,
        style,
        styles.glassBase,
        paddingStyle,
        variant === "ghost" && styles.ghostBase,
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={variant === "ghost" ? styles.ghostLabel : styles.glassLabel}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  solidBase: {
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.cyan,
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  solidLabel: {
    color: "#04141A",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.2,
  },
  glassBase: {
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  glassLabel: {
    color: colors.ink,
    fontWeight: "600",
    fontSize: 15,
  },
  ghostBase: {
    backgroundColor: "transparent",
    borderColor: "rgba(255,255,255,0.10)",
  },
  ghostLabel: {
    color: colors.inkDim,
    fontWeight: "600",
    fontSize: 14,
  },
  disabled: {
    opacity: 0.4,
  },
});
