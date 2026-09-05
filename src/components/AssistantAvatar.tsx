import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, {
  Circle,
  Path,
  Ellipse,
  G,
  Rect,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { AssistantMood } from '../types/survey';

interface AssistantAvatarProps {
  mood: AssistantMood;
  size?: number;
}

export const AssistantAvatar: React.FC<AssistantAvatarProps> = ({
  mood,
  size = 110,
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Gentle floating animation
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );
    float.start();
    return () => float.stop();
  }, [floatAnim]);

  useEffect(() => {
    // Mood change bounce
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.12,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.spring(pulseAnim, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [mood, pulseAnim]);

  // Determine eyes and mouth paths based on mood
  const renderFace = () => {
    switch (mood) {
      case 'waving':
      case 'happy':
        return (
          <>
            {/* Happy curved eyes (^ ^) */}
            <Path
              d="M36 50 Q43 42 50 50"
              stroke="#3D291D"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <Path
              d="M70 50 Q77 42 84 50"
              stroke="#3D291D"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Open happy mouth */}
            <Path
              d="M52 59 Q60 69 68 59"
              stroke="#3D291D"
              strokeWidth="3"
              strokeLinecap="round"
              fill="#E26D5C"
            />
          </>
        );

      case 'curious':
        return (
          <>
            {/* Big round curious eyes with sparkle */}
            <Circle cx="44" cy="49" r="6.5" fill="#3D291D" />
            <Circle cx="42" cy="47" r="2.5" fill="#FFFFFF" />
            <Circle cx="76" cy="49" r="6.5" fill="#3D291D" />
            <Circle cx="74" cy="47" r="2.5" fill="#FFFFFF" />
            {/* Small 'o' mouth */}
            <Circle cx="60" cy="62" r="3" fill="#E26D5C" />
          </>
        );

      case 'gaming':
        return (
          <>
            {/* Starry excited gamer eyes */}
            <G transform="translate(37, 43)">
              <Path
                d="M7 0 L9 5 L14 7 L9 9 L7 14 L5 9 L0 7 L5 5 Z"
                fill="#D49244"
              />
            </G>
            <G transform="translate(69, 43)">
              <Path
                d="M7 0 L9 5 L14 7 L9 9 L7 14 L5 9 L0 7 L5 5 Z"
                fill="#D49244"
              />
            </G>
            {/* Gamer headset */}
            <Path
              d="M26 44 C24 22, 96 22, 94 44"
              stroke="#5C4130"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <Rect x="20" y="40" width="8" height="14" rx="4" fill="#8A5333" />
            <Rect x="92" y="40" width="8" height="14" rx="4" fill="#8A5333" />
            {/* Big grin */}
            <Path
              d="M50 60 Q60 70 70 60"
              stroke="#3D291D"
              strokeWidth="3"
              strokeLinecap="round"
              fill="#E26D5C"
            />
          </>
        );

      case 'inspecting':
        return (
          <>
            {/* Left eye normal, right eye with monocle/loupe */}
            <Circle cx="43" cy="49" r="5" fill="#3D291D" />
            <Circle cx="41.5" cy="47.5" r="2" fill="#FFFFFF" />
            {/* Monocle on right eye */}
            <Circle
              cx="77"
              cy="48"
              r="8"
              stroke="#D49244"
              strokeWidth="2.5"
              fill="rgba(212, 146, 68, 0.15)"
            />
            <Circle cx="77" cy="48" r="5" fill="#3D291D" />
            <Circle cx="75" cy="46" r="2" fill="#FFFFFF" />
            <Path
              d="M84 53 L90 62"
              stroke="#D49244"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Thoughtful smirk */}
            <Path
              d="M54 62 Q61 65 67 61"
              stroke="#3D291D"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        );

      case 'celebrating':
        return (
          <>
            {/* Joyful closed eyes */}
            <Path
              d="M36 50 Q43 43 50 50"
              stroke="#3D291D"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <Path
              d="M70 50 Q77 43 84 50"
              stroke="#3D291D"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Wide ecstatic smile */}
            <Path
              d="M48 58 Q60 74 72 58 Z"
              fill="#E26D5C"
              stroke="#3D291D"
              strokeWidth="2.5"
            />
            {/* Golden mini-crown */}
            <Path
              d="M46 22 L52 28 L60 19 L68 28 L74 22 L72 32 L48 32 Z"
              fill="#F5B743"
              stroke="#9A6318"
              strokeWidth="1.5"
            />
          </>
        );

      case 'impressed':
        return (
          <>
            {/* Diamond sparkle eyes */}
            <Path
              d="M43 42 L46 48 L43 54 L40 48 Z"
              fill="#D49244"
            />
            <Path
              d="M77 42 L80 48 L77 54 L74 48 Z"
              fill="#D49244"
            />
            {/* Clapping paws or excited smile */}
            <Path
              d="M52 60 Q60 67 68 60"
              stroke="#3D291D"
              strokeWidth="3"
              strokeLinecap="round"
              fill="#E26D5C"
            />
          </>
        );

      case 'note':
      default:
        return (
          <>
            {/* Attentive sweet eyes */}
            <Circle cx="44" cy="49" r="5" fill="#3D291D" />
            <Circle cx="42.5" cy="47.5" r="2" fill="#FFFFFF" />
            <Circle cx="76" cy="49" r="5" fill="#3D291D" />
            <Circle cx="74.5" cy="47.5" r="2" fill="#FFFFFF" />
            {/* Polite smile */}
            <Path
              d="M54 60 Q60 65 66 60"
              stroke="#3D291D"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        );
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [
            { translateY: floatAnim },
            { scale: pulseAnim },
          ],
        },
      ]}
    >
      <Svg viewBox="0 0 120 120" width={size} height={size}>
        <Defs>
          {/* Fur Gradient */}
          <LinearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFF9F2" />
            <Stop offset="100%" stopColor="#EADCCB" />
          </LinearGradient>
          <LinearGradient id="earGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#C99F84" />
            <Stop offset="100%" stopColor="#A8775B" />
          </LinearGradient>
          <LinearGradient id="beretGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#8A5333" />
            <Stop offset="100%" stopColor="#5E351F" />
          </LinearGradient>
        </Defs>

        {/* Soft shadow under mascot */}
        <Ellipse
          cx="60"
          cy="112"
          rx="32"
          ry="6"
          fill="rgba(80, 52, 35, 0.12)"
        />

        {/* Cozy bear ears */}
        <Circle cx="30" cy="34" r="16" fill="url(#earGrad)" />
        <Circle cx="30" cy="34" r="10" fill="#F4D9C8" />
        <Circle cx="90" cy="34" r="16" fill="url(#earGrad)" />
        <Circle cx="90" cy="34" r="10" fill="#F4D9C8" />

        {/* Main Head / Body */}
        <Ellipse
          cx="60"
          cy="60"
          rx="44"
          ry="40"
          fill="url(#bodyGrad)"
          stroke="#D4BEA9"
          strokeWidth="2.5"
        />

        {/* Clan Beret / Assistant Cap (cozy tilted cap) */}
        {mood !== 'celebrating' && mood !== 'gaming' && (
          <G transform="translate(32, 14) rotate(-8)">
            <Path
              d="M0 16 C8 4, 46 2, 54 14 C48 20, 10 22, 0 16 Z"
              fill="url(#beretGrad)"
            />
            {/* Clan mini golden star badge */}
            <Circle cx="28" cy="14" r="3.5" fill="#F5B743" />
          </G>
        )}

        {/* Rosy blush cheeks */}
        <Ellipse cx="33" cy="56" rx="6" ry="3.5" fill="rgba(235, 130, 115, 0.45)" />
        <Ellipse cx="87" cy="56" rx="6" ry="3.5" fill="rgba(235, 130, 115, 0.45)" />

        {/* Cute button nose */}
        <Ellipse cx="60" cy="55" rx="3.5" ry="2.5" fill="#4A3427" />

        {/* Dynamic eyes and mouth */}
        {renderFace()}

        {/* Mascot Paws / Accessories */}
        {mood === 'waving' ? (
          // Waving paw
          <G transform="translate(86, 68) rotate(-20)">
            <Ellipse
              cx="12"
              cy="8"
              rx="9"
              ry="7"
              fill="#FFFDFB"
              stroke="#D4BEA9"
              strokeWidth="2"
            />
            {/* Sparkle near paw */}
            <Path
              d="M20 0 L22 4 L26 5 L22 6 L20 10 L18 6 L14 5 L18 4 Z"
              fill="#D49244"
            />
          </G>
        ) : mood === 'note' ? (
          // Mini notepad
          <G transform="translate(20, 72) rotate(10)">
            <Rect
              x="0"
              y="0"
              width="20"
              height="24"
              rx="3"
              fill="#FFFDF7"
              stroke="#8A5333"
              strokeWidth="2"
            />
            <Path
              d="M4 6 L16 6 M4 11 L16 11 M4 16 L12 16"
              stroke="#C49774"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </G>
        ) : null}
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
