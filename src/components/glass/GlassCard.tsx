import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

interface GlassCardProps extends ViewProps {
  intensity?: number;
  radius?: number;
  padded?: boolean;
}

/**
 * The base frosted-glass surface used throughout Iron Paws.
 * BlurView gives the real backdrop blur; the rgba overlay + hairline
 * border on top is what sells the "glass" look on both light and dark
 * content behind it.
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 32,
  radius = 24,
  padded = true,
  ...rest
}) => {
  return (
    <View
      style={[{ borderRadius: radius }, styles.clip, style]}
      {...rest}
    >
      <BlurView
        intensity={intensity}
        tint="dark"
        style={StyleSheet.absoluteFillObject}
      />
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: "rgba(255,255,255,0.055)" },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            borderRadius: radius,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.14)",
          },
        ]}
      />
      {/* top highlight sliver — the "light hitting glass" edge */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: radius * 0.6,
          right: radius * 0.6,
          height: 1,
          backgroundColor: "rgba(255,255,255,0.5)",
          opacity: 0.35,
        }}
      />
      <View style={padded ? styles.padding : undefined}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  clip: {
    overflow: "hidden",
  },
  padding: {
    padding: 16,
  },
});
