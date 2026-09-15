import * as Haptics from "expo-haptics";

// iOS's strongest single impact is "Heavy" — there's no stronger built-in
// style. To make interactions feel more intense we stack pulses instead of
// relying on a single impact, which reads as noticeably punchier on device.

const heavy = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
const rigid = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);

export const hapticTap = () => {
  heavy();
};

// A tight double-thump for selection-style moments (checkmarks, zoom levels).
export const hapticSelect = () => {
  heavy();
  setTimeout(rigid, 55);
};

export const hapticStrong = () => {
  heavy();
  setTimeout(heavy, 60);
};

export const hapticSuccess = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

export const hapticWarning = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};

// The big one — logging a session, hitting a goal. Heavy, heavy, then the
// system success chime on top.
export const hapticCelebrate = () => {
  heavy();
  setTimeout(heavy, 90);
  setTimeout(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, 200);
};
