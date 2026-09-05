import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Theme } from '../constants/theme';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitle?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  stepTitle,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  const progressFraction = Math.max(0, Math.min(1, currentStep / totalSteps));
  const progressPercent = Math.round(progressFraction * 100);

  useEffect(() => {
    Animated.spring(animatedWidth, {
      toValue: progressFraction,
      friction: 8,
      tension: 40,
      useNativeDriver: false, // width animation requires false in standard RN
    }).start();
  }, [progressFraction, animatedWidth]);

  const widthInterpolation = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.badgeContainer}>
          <Text style={styles.stepBadge}>
            {currentStep === 0
              ? 'Introduction'
              : currentStep > totalSteps
              ? 'Complete'
              : `Step ${currentStep} of ${totalSteps}`}
          </Text>
          {stepTitle && <Text style={styles.stepTitle}> • {stepTitle}</Text>}
        </View>
        <Text style={styles.percentageText}>{progressPercent}%</Text>
      </View>

      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: widthInterpolation,
            },
          ]}
        />
      </View>

      {/* Step milestone dots */}
      <View style={styles.milestonesRow}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isCompleted = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;

          return (
            <View
              key={index}
              style={[
                styles.dot,
                isCompleted && styles.dotCompleted,
                isCurrent && styles.dotCurrent,
              ]}
            >
              {isCompleted && <View style={styles.innerDotCheck} />}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.primary,
    letterSpacing: 0.3,
  },
  stepTitle: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    fontWeight: '500',
  },
  percentageText: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
  },
  track: {
    height: 8,
    backgroundColor: Theme.colors.progressBg,
    borderRadius: Theme.radii.full,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radii.full,
  },
  milestonesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 2,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Theme.colors.progressBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCompleted: {
    backgroundColor: Theme.colors.primary,
  },
  dotCurrent: {
    backgroundColor: Theme.colors.accentGold,
    transform: [{ scale: 1.4 }],
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: Theme.colors.accentGold,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  innerDotCheck: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
});
