import React from "react";
import { View, Text } from "react-native";
import { formatDayLong } from "@/utils/date";
import { colors } from "@/theme/colors";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import type { WorkoutDay } from "@/types";

interface Props {
  dateKey: string;
  day: WorkoutDay | undefined;
  volume: number;
  onBack: () => void;
}

export const DayDetail: React.FC<Props> = ({ dateKey, day, volume, onBack }) => {
  const hasContent = day && day.exercises.length > 0;

  return (
    <View>
      <View className="flex-row items-center justify-between mb-3">
        <Text style={{ color: colors.ink }} className="text-base font-semibold">
          {formatDayLong(dateKey)}
        </Text>
        <GlassButton label="Back" compact variant="ghost" onPress={onBack} />
      </View>

      {!hasContent && (
        <GlassCard>
          <Text style={{ color: colors.inkDim }} className="text-center py-4">
            Rest day — nothing logged.
          </Text>
        </GlassCard>
      )}

      {hasContent && (
        <View>
          <GlassCard style={{ marginBottom: 10 }}>
            <Text style={{ color: colors.inkFaint }} className="text-xs uppercase tracking-wide mb-1">
              Total volume
            </Text>
            <Text style={{ color: colors.emerald }} className="text-2xl font-bold">
              {volume.toLocaleString()} <Text style={{ color: colors.inkDim, fontSize: 14 }}>lbs</Text>
            </Text>
          </GlassCard>

          {day!.exercises.map((ex) => (
            <GlassCard key={ex.id} style={{ marginBottom: 10 }}>
              <Text style={{ color: colors.ink }} className="text-[15px] font-semibold mb-2">
                {ex.name}
              </Text>
              {ex.sets.length === 0 && (
                <Text style={{ color: colors.inkFaint, fontSize: 13 }}>No sets logged</Text>
              )}
              {ex.sets.map((s) => (
                <View
                  key={s.id}
                  className="flex-row items-center justify-between py-1.5"
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: "rgba(255,255,255,0.06)",
                  }}
                >
                  <Text style={{ color: colors.inkFaint, width: 46 }}>Set {s.index}</Text>
                  <Text style={{ color: colors.ink }}>
                    {s.weight} {s.unit} × {s.reps}
                  </Text>
                  <Text
                    style={{
                      color: s.completed ? colors.emerald : colors.inkFaint,
                      fontWeight: "700",
                    }}
                  >
                    {s.completed ? "✓" : "—"}
                  </Text>
                </View>
              ))}
            </GlassCard>
          ))}
        </View>
      )}
    </View>
  );
};
