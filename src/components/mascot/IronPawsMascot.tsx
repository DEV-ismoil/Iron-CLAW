import React, { useEffect } from "react";
import { View } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Polygon,
  Circle,
  Line,
  G,
} from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { colors } from "@/theme/colors";
import type { MascotState } from "@/types";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

interface Props {
  state: MascotState;
  size?: number;
}

// Geometry mirrors the app-icon mark so the in-app mascot and the icon
// read as the same character. All numbers are fractions of a 240x240 box.
const VB = 240;
const CX = VB / 2;
const CY = VB / 2;
const W = VB * 0.66;
const H = VB * 0.66;

const top = `${CX},${CY - H * 0.58}`;
const leftEarTip = `${CX - W * 0.56},${CY - H * 0.66}`;
const rightEarTip = `${CX + W * 0.56},${CY - H * 0.66}`;
const leftEarBase = `${CX - W * 0.2},${CY - H * 0.22}`;
const rightEarBase = `${CX + W * 0.2},${CY - H * 0.22}`;
const leftCheek = `${CX - W * 0.5},${CY + H * 0.02}`;
const rightCheek = `${CX + W * 0.5},${CY + H * 0.02}`;
const leftJaw = `${CX - W * 0.3},${CY + H * 0.5}`;
const rightJaw = `${CX + W * 0.3},${CY + H * 0.5}`;
const chin = `${CX},${CY + H * 0.62}`;
const midUpper = `${CX},${CY - H * 0.05}`;

const leftFace = [
  top,
  leftEarBase,
  leftEarTip,
  `${CX - W * 0.3},${CY - H * 0.3}`,
  leftCheek,
  leftJaw,
  chin,
  midUpper,
].join(" ");

const rightFace = [
  top,
  rightEarBase,
  rightEarTip,
  `${CX + W * 0.3},${CY - H * 0.3}`,
  rightCheek,
  rightJaw,
  chin,
  midUpper,
].join(" ");

const eyeY = CY - H * 0.02;
const eyeOffsetX = W * 0.2;
const eyeW = W * 0.2;
const eyeH = H * 0.045;

const eyePoints = (dir: 1 | -1) => {
  const ex = CX + dir * eyeOffsetX;
  return [
    `${ex - eyeW / 2},${eyeY}`,
    `${ex - eyeW * 0.1},${eyeY - eyeH}`,
    `${ex + eyeW / 2},${eyeY - eyeH * 0.3}`,
    `${ex + eyeW * 0.1},${eyeY + eyeH}`,
    `${ex - eyeW * 0.35},${eyeY + eyeH * 0.6}`,
  ].join(" ");
};

export const IronPawsMascot: React.FC<Props> = ({ state, size = 72 }) => {
  const breathe = useSharedValue(1);
  const glow = useSharedValue(0.4);
  const ringScale = useSharedValue(0.6);
  const ringOpacity = useSharedValue(0);
  const bounceY = useSharedValue(0);
  const bounceScale = useSharedValue(1);

  useEffect(() => {
    // Reset any in-flight loops before switching personality.
    cancelAnimation(breathe);
    cancelAnimation(glow);
    cancelAnimation(ringScale);
    cancelAnimation(ringOpacity);
    cancelAnimation(bounceY);
    cancelAnimation(bounceScale);

    if (state === "resting") {
      breathe.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
      glow.value = withRepeat(
        withSequence(
          withTiming(0.55, { duration: 1800 }),
          withTiming(0.3, { duration: 1800 })
        ),
        -1,
        false
      );
      ringOpacity.value = withTiming(0, { duration: 300 });
      bounceY.value = withTiming(0, { duration: 200 });
      bounceScale.value = withTiming(1, { duration: 200 });
    }

    if (state === "pulsing") {
      breathe.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 480, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 480, easing: Easing.in(Easing.quad) })
        ),
        -1,
        false
      );
      glow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 480 }),
          withTiming(0.45, { duration: 480 })
        ),
        -1,
        false
      );
      ringOpacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 480 }),
          withTiming(0.08, { duration: 480 })
        ),
        -1,
        false
      );
      ringScale.value = withRepeat(
        withSequence(
          withTiming(0.85, { duration: 480 }),
          withTiming(1.05, { duration: 480 })
        ),
        -1,
        false
      );
    }

    if (state === "celebrating") {
      bounceScale.value = withSequence(
        withTiming(1.22, { duration: 160, easing: Easing.out(Easing.back(2)) }),
        withTiming(0.92, { duration: 130 }),
        withTiming(1.08, { duration: 130 }),
        withTiming(1, { duration: 160 })
      );
      bounceY.value = withSequence(
        withTiming(-14, { duration: 160 }),
        withTiming(4, { duration: 130 }),
        withTiming(0, { duration: 160 })
      );
      glow.value = withSequence(
        withTiming(1, { duration: 120 }),
        withRepeat(
          withSequence(
            withTiming(0.7, { duration: 260 }),
            withTiming(1, { duration: 260 })
          ),
          3,
          true
        )
      );
      // Three staggered radiating rings
      ringOpacity.value = withSequence(
        withTiming(0.7, { duration: 40 }),
        withDelay(60, withTiming(0, { duration: 700 }))
      );
      ringScale.value = withSequence(
        withTiming(0.5, { duration: 0 }),
        withTiming(1.7, { duration: 760, easing: Easing.out(Easing.quad) })
      );
    }
  }, [state]);

  const groupAnimatedProps = useAnimatedProps(() => {
    const s = breathe.value * bounceScale.value;
    return {
      transform: [
        { translateX: CX },
        { translateY: CY + bounceY.value },
        { scale: s },
        { translateX: -CX },
        { translateY: -CY },
      ],
    } as any;
  });

  const leftGlowProps = useAnimatedProps(() => ({
    opacity: glow.value,
  }));
  const rightGlowProps = useAnimatedProps(() => ({
    opacity: glow.value,
  }));
  const ringProps = useAnimatedProps(() => ({
    opacity: ringOpacity.value,
    r: 30 + ringScale.value * 70,
  }));

  const ringColor = state === "celebrating" ? colors.emerald : colors.cyan;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${VB} ${VB}`}>
        <Defs>
          <LinearGradient id="leftChrome" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.chrome.shadow} />
            <Stop offset="1" stopColor={colors.chrome.dark} />
          </LinearGradient>
          <LinearGradient id="rightChrome" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.chrome.light} />
            <Stop offset="1" stopColor={colors.chrome.highlight} />
          </LinearGradient>
        </Defs>

        {/* status ring — grows/fades based on mascot state */}
        <AnimatedCircle
          cx={CX}
          cy={CY}
          r={60}
          stroke={ringColor}
          strokeWidth={2}
          fill="none"
          animatedProps={ringProps}
        />

        <AnimatedG animatedProps={groupAnimatedProps}>
          <Polygon points={leftFace} fill="url(#leftChrome)" />
          <Polygon points={rightFace} fill="url(#rightChrome)" />
          <Line
            x1={CX}
            y1={CY - H * 0.58}
            x2={CX}
            y2={CY + H * 0.62}
            stroke="rgba(255,255,255,0.55)"
            strokeWidth={1.5}
          />

          {/* eye glows (behind the eye shapes) */}
          <AnimatedCircle
            cx={CX - eyeOffsetX}
            cy={eyeY}
            r={eyeW * 0.55}
            fill={colors.cyan}
            animatedProps={leftGlowProps}
          />
          <AnimatedCircle
            cx={CX + eyeOffsetX}
            cy={eyeY}
            r={eyeW * 0.55}
            fill={colors.cyan}
            animatedProps={rightGlowProps}
          />

          <Polygon points={eyePoints(-1)} fill={colors.cyan} />
          <Polygon points={eyePoints(1)} fill={colors.cyan} />

          <Polygon
            points={`${CX - 4},${CY + H * 0.14} ${CX + 4},${CY + H * 0.14} ${CX},${CY + H * 0.2}`}
            fill={colors.chrome.shadow}
          />
        </AnimatedG>
      </Svg>
    </View>
  );
};
