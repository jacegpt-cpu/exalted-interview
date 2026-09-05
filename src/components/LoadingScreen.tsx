import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Theme } from '../constants/theme';

interface LoadingScreenProps {
  onDismiss?: () => void;
  showDismiss?: boolean;
}

const PANIC_MESSAGES = [
  'Waaaah! Plugging in the recruitment cables as fast as I can! 🔌💦',
  'Sorting through clan paperwork before they fly away! 📄🌪️',
  'Tightening the server bolts with my tiny wrench! 🔧⚡',
  'Running on the Exalted hamster wheel for extra bandwidth! 🏃💨',
  'Boss is watching! Making it load super fast, please hold on! (｡>﹏<｡)✨',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onDismiss,
  showDismiss = false,
}) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Shake animation for the panicking assistant
  useEffect(() => {
    const shake = Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: -4,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 4,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -3,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 3,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 80,
          useNativeDriver: true,
        }),
      ])
    );
    shake.start();
    return () => shake.stop();
  }, [shakeAnim]);

  // Cycle funny panic messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % PANIC_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Loading bar animation
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 0.85,
          duration: 1800,
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0.98,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [progressAnim]);

  const widthInterpolation = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['15%', '100%'],
  });

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <View style={styles.badgeRow}>
          <Text style={styles.badgeText}>⚠️ PANIC MODE: LOADING AS FAST AS POSSIBLE</Text>
        </View>

        {/* Panicking Assistant Image */}
        <Animated.View
          style={[
            styles.imageContainer,
            { transform: [{ translateX: shakeAnim }] },
          ]}
        >
          <Image
            source={require('../../assets/images/panicking-assistant.png')}
            style={styles.assistantImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Humorous Panic Message */}
        <View style={styles.dialogueBox}>
          <Text style={styles.dialogueText}>
            {PANIC_MESSAGES[messageIndex]}
          </Text>
        </View>

        {/* Animated Loading Bar */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressBar,
              { width: widthInterpolation },
            ]}
          />
        </View>

        <Text style={styles.subtext}>
          Please don't close the tab! The assistant is working overtime!
        </Text>

        {showDismiss && onDismiss && (
          <TouchableOpacity
            onPress={onDismiss}
            style={styles.continueBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.continueText}>Ready! Enter Interview ✨</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(250, 247, 242, 0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radii.xl,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.cardBorder,
    shadowColor: '#3E2A1E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 28,
    elevation: 6,
  },
  badgeRow: {
    backgroundColor: '#FDEEE9',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Theme.radii.full,
    borderWidth: 1,
    borderColor: '#E8A395',
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B84534',
    letterSpacing: 0.6,
  },
  imageContainer: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  assistantImage: {
    width: '100%',
    height: '100%',
  },
  dialogueBox: {
    backgroundColor: Theme.colors.primaryLight,
    borderWidth: 1.5,
    borderColor: Theme.colors.cardBorderHover,
    borderRadius: Theme.radii.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    marginBottom: 16,
  },
  dialogueText: {
    fontSize: 14,
    lineHeight: 20,
    color: Theme.colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 10,
    backgroundColor: Theme.colors.progressBg,
    borderRadius: Theme.radii.full,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Theme.colors.accentGold,
    borderRadius: Theme.radii.full,
  },
  subtext: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  continueBtn: {
    marginTop: 16,
    backgroundColor: Theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: Theme.radii.full,
  },
  continueText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
