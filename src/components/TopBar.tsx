import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { IronPawsMascot } from "@/components/mascot/IronPawsMascot";
import { colors } from "@/theme/colors";
import type { MascotState } from "@/types";

interface Props {
  streak: number;
  mascotState: MascotState;
}

export const TopBar: React.FC<Props> = ({ streak, mascotState }) => {
  return (
    <View>
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFillObject} />
      <View style={styles.tint} />
      <View className="flex-row items-center justify-between px-5 pt-1 pb-2">
        <Text
          style={{ color: colors.inkFaint }}
          className="text-xs uppercase tracking-widest font-bold"
        >
          Iron Paws
        </Text>

        <View className="flex-row items-center">
          <View className="items-end mr-2">
            <Text style={{ color: colors.emerald }} className="text-base font-bold leading-4">
              {streak}
            </Text>
            <Text style={{ color: colors.inkFaint }} className="text-[9px] uppercase tracking-wide">
              day streak
            </Text>
          </View>
          <IronPawsMascot state={mascotState} size={44} />
        </View>
      </View>
      <View style={styles.hairline} />
    </View>
  );
};

const styles = StyleSheet.create({
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,11,13,0.4)",
  },
  hairline: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
});
