import React, { useMemo } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { dateKey, keyToDate, MONTHS_SHORT } from "@/utils/date";
import { heatColor } from "@/theme/colors";
import { colors } from "@/theme/colors";
import type { HeatLevel } from "@/theme/colors";

interface Props {
  year: number;
  heatLevelForDay: (key: string) => HeatLevel;
  onSelectMonth: (month: number) => void;
}

const CELL = 17;
const GAP = 5;

// Build columns of 7 (Sun-Sat) covering Jan 1 -> Dec 31 of `year`,
// padded with nulls so every column is a full week.
function buildWeeks(year: number): (string | null)[][] {
  const jan1 = new Date(year, 0, 1);
  const startPad = jan1.getDay(); // days to pad before Jan 1 in week 0
  const dec31 = new Date(year, 11, 31);

  const cells: (string | null)[] = new Array(startPad).fill(null);
  const cursor = new Date(jan1);
  while (cursor <= dec31) {
    cells.push(dateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export const YearHeatmap: React.FC<Props> = ({
  year,
  heatLevelForDay,
  onSelectMonth,
}) => {
  const weeks = useMemo(() => buildWeeks(year), [year]);

  // Label each month at the column where its 1st falls.
  const monthLabels = useMemo(() => {
    const labels: { col: number; label: string; month: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, col) => {
      const firstReal = week.find((k) => k !== null);
      if (!firstReal) return;
      const d = keyToDate(firstReal);
      if (d.getDate() <= 7 && d.getMonth() !== lastMonth) {
        labels.push({ col, label: MONTHS_SHORT[d.getMonth()], month: d.getMonth() });
        lastMonth = d.getMonth();
      }
    });
    return labels;
  }, [weeks]);

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={{ flexDirection: "row", marginBottom: 4, marginLeft: 2 }}>
            {weeks.map((_, col) => {
              const found = monthLabels.find((m) => m.col === col);
              return (
                <Pressable
                  key={col}
                  onPress={() => found && onSelectMonth(found.month)}
                  style={{ width: CELL + GAP }}
                >
                  {found ? (
                    <Text style={{ color: colors.inkDim, fontSize: 11, fontWeight: "600" }}>
                      {found.label}
                    </Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
          <View style={{ flexDirection: "row" }}>
            {weeks.map((week, col) => (
              <Pressable
                key={col}
                onPress={() => {
                  const real = week.find((k) => k !== null);
                  if (real) onSelectMonth(keyToDate(real).getMonth());
                }}
                style={{ marginRight: GAP }}
              >
                {week.map((key, row) => {
                  const level = key ? heatLevelForDay(key) : 0;
                  return (
                    <View
                      key={row}
                      style={{
                        width: CELL,
                        height: CELL,
                        marginBottom: GAP,
                        borderRadius: 4,
                        backgroundColor: key ? heatColor(level) : "transparent",
                        borderWidth: level > 0 ? 1 : 0,
                        borderColor: level >= 3 ? colors.emerald : colors.cyan,
                        shadowColor: level >= 3 ? colors.emerald : colors.cyan,
                        shadowOpacity: level >= 2 ? 0.9 : 0,
                        shadowRadius: level >= 3 ? 8 : 5,
                        shadowOffset: { width: 0, height: 0 },
                      }}
                    />
                  );
                })}
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="flex-row items-center justify-end mt-3">
        <Text style={{ color: colors.inkFaint, fontSize: 11, marginRight: 6 }}>
          Less
        </Text>
        {[0, 1, 2, 3, 4].map((lvl) => (
          <View
            key={lvl}
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              marginRight: 3,
              backgroundColor: heatColor(lvl as HeatLevel),
            }}
          />
        ))}
        <Text style={{ color: colors.inkFaint, fontSize: 11, marginLeft: 3 }}>
          More
        </Text>
      </View>
    </View>
  );
};
