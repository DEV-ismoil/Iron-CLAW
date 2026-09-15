import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GlassCard } from "@/components/glass/GlassCard";
import { colors } from "@/theme/colors";
import { formatMMSS } from "@/utils/date";
import { hapticTap, hapticSelect, hapticWarning } from "@/utils/haptics";

interface Props {
  onRunningChange?: (running: boolean) => void;
}

const PRESETS = [30, 60, 90];
const TICK_MS = 250;

const BADGE_SIZE = 56;
const STROKE = 4;
const RADIUS = (BADGE_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Lives entirely outside any ScrollView — it's rendered once, fixed to the
 * top-right corner, and is never affected by scroll position on either page.
 * Collapsed it's a small glowing ring showing time left; tapping it opens the
 * full control panel as a dropdown anchored below the badge.
 */
export const WorkoutTimer: React.FC<Props> = ({ onRunningChange }) => {
  const insets = useSafeAreaInsets();
  const [remaining, setRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [running, setRunning] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const endAtRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const tick = useCallback(() => {
    if (endAtRef.current == null) return;
    const left = Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000));
    setRemaining(left);
    if (left <= 0) {
      setRunning(false);
      endAtRef.current = null;
      setTotalDuration(0);
      stopInterval();
      hapticWarning();
    }
  }, []);

  useEffect(() => {
    onRunningChange?.(running);
  }, [running, onRunningChange]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, TICK_MS);
    } else {
      stopInterval();
    }
    return stopInterval;
  }, [running, tick]);

  const addSeconds = (secs: number) => {
    hapticTap();
    setRemaining((prev) => {
      const next = prev + secs;
      endAtRef.current = Date.now() + next * 1000;
      return next;
    });
    setTotalDuration((prev) => prev + secs);
    setRunning(true);
    setExpanded(true);
  };

  const toggleRunning = () => {
    if (remaining <= 0) return;
    hapticSelect();
    if (running) {
      setRunning(false);
      endAtRef.current = null;
    } else {
      endAtRef.current = Date.now() + remaining * 1000;
      setRunning(true);
    }
  };

  const reset = () => {
    hapticTap();
    setRunning(false);
    endAtRef.current = null;
    setRemaining(0);
    setTotalDuration(0);
  };

  const toggleExpanded = () => {
    hapticTap();
    setExpanded((e) => !e);
  };

  const fraction = totalDuration > 0 ? remaining / totalDuration : 0;
  const dashoffset = CIRCUMFERENCE * (1 - fraction);
  const ringColor = running ? colors.emerald : colors.cyan;
  const topOffset = insets.top + 58;

  return (
    <>
      {expanded && (
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={() => setExpanded(false)}
        />
      )}

      {expanded && (
        <View style={{ position: "absolute", top: topOffset + BADGE_SIZE + 8, right: 16, width: 240 }}>
          <GlassCard radius={22}>
            <View className="flex-row items-center justify-between mb-2">
              <Text style={{ color: colors.inkFaint, fontSize: 11, fontWeight: "700", letterSpacing: 1 }}>
                REST TIMER
              </Text>
              <Pressable onPress={() => setExpanded(false)} hitSlop={8}>
                <Ionicons name="close" size={18} color={colors.inkFaint} />
              </Pressable>
            </View>

            <Text
              style={{
                color: running ? colors.emerald : colors.ink,
                fontSize: 34,
                fontWeight: "800",
                fontVariant: ["tabular-nums"],
                marginBottom: 10,
              }}
            >
              {formatMMSS(remaining)}
            </Text>

            <View className="flex-row" style={{ gap: 8, marginBottom: 12 }}>
              {PRESETS.map((p) => (
                <Pressable key={p} onPress={() => addSeconds(p)} style={styles.presetPill}>
                  <Text style={styles.presetLabel}>+{p}s</Text>
                </Pressable>
              ))}
            </View>

            <View className="flex-row items-center" style={{ gap: 10 }}>
              <Pressable onPress={reset} style={styles.iconBtn}>
                <Ionicons name="refresh" size={16} color={colors.inkDim} />
              </Pressable>
              <Pressable
                onPress={toggleRunning}
                style={[styles.playBtn, remaining <= 0 && { opacity: 0.4 }]}
              >
                <Ionicons name={running ? "pause" : "play"} size={17} color="#04141A" />
              </Pressable>
            </View>
          </GlassCard>
        </View>
      )}

      <View style={{ position: "absolute", top: topOffset, right: 16 }}>
        <Pressable onPress={toggleExpanded}>
          <View style={styles.badgeWrap}>
            <Svg width={BADGE_SIZE} height={BADGE_SIZE}>
              <Circle
                cx={BADGE_SIZE / 2}
                cy={BADGE_SIZE / 2}
                r={RADIUS}
                stroke="rgba(255,255,255,0.14)"
                strokeWidth={STROKE}
                fill="rgba(20,22,26,0.55)"
              />
              {totalDuration > 0 && (
                <Circle
                  cx={BADGE_SIZE / 2}
                  cy={BADGE_SIZE / 2}
                  r={RADIUS}
                  stroke={ringColor}
                  strokeWidth={STROKE}
                  fill="none"
                  strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                  strokeDashoffset={dashoffset}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${BADGE_SIZE / 2} ${BADGE_SIZE / 2})`}
                />
              )}
            </Svg>
            <View style={StyleSheet.absoluteFillObject} className="items-center justify-center">
              {remaining > 0 ? (
                <Text style={{ color: colors.ink, fontSize: 12, fontWeight: "800" }}>
                  {formatMMSS(remaining)}
                </Text>
              ) : (
                <Ionicons name="timer-outline" size={20} color={colors.inkDim} />
              )}
            </View>
          </View>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  badgeWrap: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    shadowColor: colors.cyan,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  presetPill: {
    backgroundColor: "rgba(63,224,255,0.14)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flex: 1,
    alignItems: "center",
  },
  presetLabel: {
    color: colors.cyanSoft,
    fontWeight: "700",
    fontSize: 12,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.emerald,
    alignItems: "center",
    justifyContent: "center",
  },
});
