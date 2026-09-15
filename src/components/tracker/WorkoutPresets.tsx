import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Modal, TextInput, Alert, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { useWorkouts } from "@/context/WorkoutContext";
import { hapticSelect, hapticTap } from "@/utils/haptics";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";

export const WorkoutPresets: React.FC = () => {
  const { presets, applyPreset, addPreset, deletePreset, todaysExercises } = useWorkouts();
  const [modalOpen, setModalOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

  const handleApply = (id: string) => {
    hapticSelect();
    applyPreset(id);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(`Delete "${name}"?`, "This routine will be removed.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deletePreset(id),
      },
    ]);
  };

  const openSaveModal = () => {
    if (todaysExercises.length === 0) {
      Alert.alert(
        "Nothing to save yet",
        "Add a few exercises to today's workout first, then save them as a routine."
      );
      return;
    }
    hapticTap();
    setNameDraft("");
    setModalOpen(true);
  };

  const confirmSave = () => {
    if (!nameDraft.trim()) return;
    addPreset(
      nameDraft,
      todaysExercises.map((e) => e.name)
    );
    setModalOpen(false);
  };

  return (
    <View className="mb-5">
      <Text style={{ color: colors.ink }} className="text-lg font-bold mb-3">
        Routines
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row" style={{ gap: 10 }}>
          {presets.map((preset) => (
            <Pressable key={preset.id} onPress={() => handleApply(preset.id)}>
              <GlassCard radius={18} padded={false} style={{ width: 132 }}>
                <View style={{ padding: 12 }}>
                  <View className="flex-row items-center justify-between mb-2">
                    <Ionicons name="barbell-outline" size={18} color={colors.cyanSoft} />
                    <Pressable
                      hitSlop={10}
                      onPress={() => handleDelete(preset.id, preset.name)}
                    >
                      <Ionicons name="close-circle" size={16} color={colors.inkFaint} />
                    </Pressable>
                  </View>
                  <Text
                    style={{ color: colors.ink, fontWeight: "700", fontSize: 14 }}
                    numberOfLines={1}
                  >
                    {preset.name}
                  </Text>
                  <Text style={{ color: colors.inkFaint, fontSize: 11, marginTop: 2 }}>
                    {preset.exerciseNames.length} exercises
                  </Text>
                </View>
              </GlassCard>
            </Pressable>
          ))}

          <Pressable onPress={openSaveModal}>
            <GlassCard
              radius={18}
              padded={false}
              style={{ width: 132, borderStyle: "dashed" }}
            >
              <View
                style={{
                  padding: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  minHeight: 78,
                }}
              >
                <Ionicons name="add-circle-outline" size={22} color={colors.emeraldSoft} />
                <Text style={{ color: colors.inkDim, fontSize: 12, marginTop: 4 }}>
                  Save today
                </Text>
              </View>
            </GlassCard>
          </Pressable>
        </View>
      </ScrollView>

      <Modal visible={modalOpen} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFillObject} />
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(0,0,0,0.35)" }]} />
          <GlassCard radius={24} style={{ width: "100%" }}>
            <Text style={{ color: colors.ink }} className="text-base font-bold mb-3">
              Save as a routine
            </Text>
            <TextInput
              value={nameDraft}
              onChangeText={setNameDraft}
              placeholder="e.g. Push Day"
              placeholderTextColor={colors.inkFaint}
              autoFocus
              style={{
                color: colors.ink,
                fontSize: 15,
                backgroundColor: "rgba(255,255,255,0.07)",
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 10,
                marginBottom: 16,
              }}
            />
            <View className="flex-row" style={{ gap: 10 }}>
              <GlassButton
                label="Cancel"
                variant="ghost"
                onPress={() => setModalOpen(false)}
                style={{ flex: 1 }}
              />
              <GlassButton
                label="Save"
                variant="solid"
                onPress={confirmSave}
                style={{ flex: 1 }}
              />
            </View>
          </GlassCard>
        </View>
      </Modal>
    </View>
  );
};
