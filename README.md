# Iron Paws 🐾

A native iOS fitness tracker built with **Expo (React Native)**, **NativeWind (Tailwind)**,
**Reanimated 3**, and **react-native-gesture-handler** — dark-mode Apple glassmorphism UI,
a custom animated chrome-panther mascot, a dedicated pinch-to-zoom calendar page, a set/rep
tracker with saved routines, goal tracking, and a corner-docked rest timer.

This project has been verified in a clean environment:
- `npx tsc --noEmit` → **0 type errors**
- `npx expo export --platform ios` → **bundles successfully** (1078 modules, Hermes bytecode)
- Every native dependency version cross-checked against Expo SDK 51's own compatibility
  manifest (`bundledNativeModules.json`) — all match

That confirms the code compiles and bundles correctly. It has **not** been run on an actual
iOS simulator/device (this was built in a sandbox with no macOS/Xcode available) — do a quick
`expo start` smoke test before you archive it for real use.

## What changed in this round

- **Three separate pages.** Calendar, Workout, and Goals now each get their own full screen
  behind a bottom tab bar instead of being stacked on one scrolling page — the calendar in
  particular has much more room to pinch-zoom comfortably.
- **Fixed: year heat-map not showing filled days.** The color levels were real but too faint
  (as low as 22% opacity) to read at an 11–15px cell size. Colors are bolder now, every filled
  cell gets an explicit border (not just a shadow, which can render inconsistently), and any
  logged day is now guaranteed a visible fill instead of possibly falling through to "empty."
- **Fixed: tapping a date showed the day after it.** Two spots (`YearHeatmap`'s month labels,
  `MonthGrid`'s day numbers) parsed a `"YYYY-MM-DD"` string with the plain `new Date(string)`
  constructor, which JavaScript treats as UTC midnight. In a negative-UTC timezone (US
  included) that rolls the *displayed* number back a day, so a cell holding the correct date
  underneath shows the wrong number — tap what's labeled "13" and you open the 14th. Fixed by
  routing through the app's existing safe local-date parser instead.
- **Timer redesigned.** The old bottom-docked bar that hid/showed based on scroll direction
  was buggy. It's now a small circular badge fixed to the top-right corner, entirely outside
  any ScrollView — it's physically impossible for it to move with scrolling. Tap it to expand
  a small control panel (presets, start/pause, reset); tap again or tap outside to collapse it.
- **Exercise list no longer stacks forever.** Exercises are now an accordion — only one is
  expanded at a time; adding a new one auto-expands it and collapses the rest.
- **Saved routines** (Workout page → Routines row) — seeded with Chest/Back/Leg/Arm/Shoulder
  Day; tap one to drop its exercises into today with three empty sets each, or build a workout
  and tap "Save today" to turn it into a reusable routine, Strong-app style.
- **New Goals tab** — Countdown goals (native iOS date wheel, shows days remaining) and
  Workout Count goals (target number of workouts, optional deadline, progress computed live
  from your actual logged days).
- **Haptics pushed further.** iOS's strongest single impact is `Heavy` — there's no stronger
  built-in style — so intensity now comes from stacking pulses (a tight Heavy-then-Rigid
  double-thump for selections, a triple pulse for celebrations) instead of one tap.
- **More glass throughout** — the top bar is now a real translucent blurred nav bar, and both
  modals blur the background behind them instead of just dimming it.

---

## 1. What's inside

- **Mascot** — `src/components/mascot/IronPawsMascot.tsx`: a geometric chrome panther-head
  built from `react-native-svg` primitives (no bitmap art), animated with Reanimated:
  - `resting` — slow breathing scale + soft eye glow
  - `pulsing` — faster breathing + glowing status ring, active while the rest timer runs
  - `celebrating` — a spring bounce + radiating ring burst, fired when you log a session
- **Top bar** (`src/components/TopBar.tsx`) — translucent blurred nav bar with the streak
  counter and the mascot as a status indicator, visible above all three tabs.
- **Calendar page** (`src/screens/CalendarScreen.tsx` + `src/components/calendar/`) — its own
  full screen, pinch-to-zoom across three levels via `react-native-gesture-handler`:
  1. **Year** — GitHub-style glowing heat-map grid (`YearHeatmap.tsx`)
  2. **Month** — bigger grid with glowing logged days and a pulsing ring on today (`MonthGrid.tsx`)
  3. **Day** — exercises, sets, weights, and total volume for that date (`DayDetail.tsx`)
  Pinch out/in to change zoom level; tap a day to jump straight to its detail view.
- **Workout page** (`src/screens/WorkoutScreen.tsx`) — Log Today button, saved routines row
  (`WorkoutPresets.tsx`), and the exercise accordion tracker (`WorkoutTracker.tsx` +
  `ExerciseCard.tsx` + `SetRow.tsx`) with auto-incrementing sets, per-set lbs/kg toggle, reps
  input, and an Apple-style checkmark.
- **Goals page** (`src/screens/GoalsScreen.tsx` + `src/components/goals/`) — Countdown goals
  with a native iOS date wheel, and Workout Count goals with an optional deadline; progress
  bars computed live against your logged workout days.
- **Rest timer** (`src/components/timer/WorkoutTimer.tsx`) — a small circular badge fixed to
  the top-right corner (outside any scroll content), expandable into a control panel with
  Start/Pause/Reset and +30s/+60s/+90s presets.
- **Bottom tab bar** (`src/navigation/GlassTabBar.tsx`) — blurred glass bar switching between
  Calendar / Workout / Goals.
- **Persistence** — workouts, presets, goals, and your lbs/kg preference are all saved to
  `AsyncStorage` (`src/utils/storage.ts`) and reloaded on launch via
  `src/context/WorkoutContext.tsx` and `src/context/GoalsContext.tsx`.

## 2. Project structure

```
iron-paws/
├── App.tsx                      # tabs, top bar, corner timer — the app shell
├── app.json                     # Expo config (bundle id, icons, splash)
├── eas.json                     # EAS Build profiles (development/preview/production)
├── babel.config.js              # NativeWind v4 + module-resolver (@/ alias) + Reanimated
├── metro.config.js              # Metro wired through NativeWind
├── tailwind.config.js           # glass/chrome/cyan/emerald design tokens
├── global.css                   # Tailwind directives (NativeWind v4 entry point)
├── assets/                      # icon.png, splash.png, adaptive-icon.png (generated mark)
└── src/
    ├── screens/                  # CalendarScreen, WorkoutScreen, GoalsScreen
    ├── navigation/GlassTabBar.tsx
    ├── components/
    │   ├── glass/                # GlassCard, GlassButton (the blur/frost primitives)
    │   ├── mascot/                # IronPawsMascot.tsx
    │   ├── calendar/              # WorkoutCalendar, YearHeatmap, MonthGrid, DayDetail
    │   ├── tracker/               # WorkoutTracker, ExerciseCard, SetRow, WorkoutPresets
    │   ├── goals/                 # AddGoalModal, GoalCard
    │   ├── timer/                 # WorkoutTimer (corner badge + panel)
    │   ├── TopBar.tsx
    │   └── LogTodayButton.tsx
    ├── context/
    │   ├── WorkoutContext.tsx     # workouts + presets + AsyncStorage sync + selectors
    │   └── GoalsContext.tsx       # goals + progress calculations
    ├── theme/colors.ts            # raw color tokens for SVG/shadow/blur (mirrors tailwind.config.js)
    ├── types/index.ts
    └── utils/{date,storage,haptics}.ts
```

## 3. Run it locally first

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your iPhone for the fastest iteration loop — everything
here (Reanimated, Gesture Handler, SVG, Blur, Haptics, the native date picker) runs fine
inside Expo Go. Only do a full native build once you're happy with it in Expo Go.

> **Why `nativewind` is pinned to `4.1.23` exactly:** newer NativeWind 4.2.x releases require
> `react-native-worklets` (Reanimated 4's new worklets package), which doesn't exist for
> Reanimated 3.x. `4.1.23` is the last release that uses `react-native-reanimated/plugin`
> directly, matching Expo SDK 51 / Reanimated 3.10. If you upgrade to Expo SDK 52+/Reanimated 4
> later, upgrade NativeWind and add `react-native-worklets` together.

---

## 4. Building a real `.ipa`

You need a Mac with Xcode for this — there is no way around that for iOS native builds,
Sideloadly included. Two realistic paths:

### Path A — Local Xcode build (free Apple ID, what Sideloadly is built for)

1. **Generate the native iOS project:**
   ```bash
   npx expo prebuild -p ios --clean
   ```
   This creates an `ios/` folder with a real Xcode workspace from your Expo config.

2. **Install CocoaPods dependencies** (prebuild usually does this automatically; if not):
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Open the workspace in Xcode:**
   ```bash
   open ios/IronPaws.xcworkspace
   ```

4. In Xcode, select the **IronPaws** target → **Signing & Capabilities** → set your
   **Team** to your personal Apple ID (free accounts work, no $99/yr Developer Program
   needed for this route). Set the destination to **Any iOS Device (arm64)**.

5. **Product → Archive.** When it finishes, the Organizer window opens.

6. Click **Distribute App → Development → Export.** Xcode signs the build with a
   free 7-day personal certificate and produces a `.ipa` file on disk.

### Path B — EAS Build (cloud, no Mac needed to build — but needs a paid Apple Developer account)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios --profile preview
```
EAS builds in the cloud and gives you a downloadable `.ipa`. For a **device-installable**
(non-App-Store) build, Apple requires the device's UDID to be registered to a
provisioning profile, which requires an active **Apple Developer Program membership
($99/yr)** — `eas device:create` registers your iPhone, then `eas build` bakes it into
the profile automatically. If you only have a free Apple ID, use Path A instead.

---

## 5. Installing the `.ipa` with Sideloadly

1. Install [Sideloadly](https://sideloadly.io/) on your Mac or PC and plug your iPhone
   in via USB (trust the computer on your phone if prompted).
2. Open Sideloadly, drag your `.ipa` file into the app window.
3. Enter your **Apple ID** email in the field provided. Using an
   [app-specific password](https://support.apple.com/en-us/102654) instead of your real
   password is recommended.
4. Click **Start**. Sideloadly re-signs the app with your Apple ID's certificate and
   installs it over USB.
5. On your iPhone, the Iron Paws icon will appear on the home screen once installation
   finishes.

**One-time trust step on the phone:** go to
**Settings → General → VPN & Device Management**, tap your Apple ID under
"Developer App", and tap **Trust**.

> A free Apple ID certificate expires after **7 days** — after that, the app will refuse
> to open until you re-sideload it (just repeat the Sideloadly steps; no rebuild needed as
> long as the `.ipa` still exists). A paid Developer Program certificate lasts a year.

## 6. Enabling Developer Mode on iOS (required on iOS 16+)

1. On the iPhone: **Settings → Privacy & Security → Developer Mode.**
2. Toggle it **on**. iOS will prompt you to restart.
3. After the restart, iOS shows a confirmation dialog — tap **Turn On** and enter your
   passcode.
4. Reconnect to Sideloadly/Xcode if the install didn't finish before the restart.

---

## 7. Known limitations / things to check on-device

- The mascot's SVG group animations use Reanimated's `useAnimatedProps` with an array-style
  `transform` on an `<G>` element — this is a well-supported pattern with
  `react-native-svg` 15.x + Reanimated 3.x, but give it a look on a real device since SVG
  transform animation is more sensitive to library versions than View animations.
- `expo-blur`'s `BlurView` intensity looks best on a real device; the iOS Simulator renders
  blur at a flatter, less convincing intensity.
- Total volume in `DayDetail` is always labeled "lbs" — if you log sets in kg, the running
  total still sums the raw numbers rather than converting, which is worth fixing if you rely
  on it for mixed-unit tracking.
