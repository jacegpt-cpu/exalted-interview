import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../constants/theme';
import { ReferralSource } from '../types/survey';
import { playSelect } from '../utils/sound';

interface ReferralSourceSelectorProps {
  value: ReferralSource | null;
  onSelect: (val: ReferralSource) => void;
}

export const ReferralSourceSelector: React.FC<ReferralSourceSelectorProps> = ({
  value,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {/* Option 1: Referred */}
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={() => {
          playSelect();
          onSelect('referred');
        }}
        style={[
          styles.card,
          value === 'referred' && styles.cardSelected,
        ]}
      >
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.iconCircle,
              value === 'referred' ? styles.iconCircleActive : styles.iconCircleDefault,
            ]}
          >
            <Text style={styles.emoji}>🤝</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.cardTitle}>Referred by an active player</Text>
            <Text style={styles.cardTagline}>Inside the Exalted clan</Text>
          </View>
          <View style={[styles.radioDot, value === 'referred' && styles.radioDotActive]}>
            {value === 'referred' && <View style={styles.radioInner} />}
          </View>
        </View>

        <Text style={styles.cardDescription}>
          An active comrade or clan member personally invited you or recommended Exalted to you!
        </Text>
      </TouchableOpacity>

      {/* Option 2: Media posts */}
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={() => {
          playSelect();
          onSelect('media');
        }}
        style={[
          styles.card,
          value === 'media' && styles.cardSelected,
        ]}
      >
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.iconCircle,
              value === 'media' ? styles.iconCircleActive : styles.iconCircleDefault,
            ]}
          >
            <Text style={styles.emoji}>📱</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.cardTitle}>Media posts</Text>
            <Text style={styles.cardTagline}>Socials, clips, or community posts</Text>
          </View>
          <View style={[styles.radioDot, value === 'media' && styles.radioDotActive]}>
            {value === 'media' && <View style={styles.radioInner} />}
          </View>
        </View>

        <Text style={styles.cardDescription}>
          You saw our posts, highlights, community clips, or page on social media!
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  card: {
    borderWidth: 2,
    borderColor: Theme.colors.cardBorder,
    borderRadius: Theme.radii.lg,
    padding: 16,
    backgroundColor: Theme.colors.inputBg,
    transitionProperty: 'all',
    transitionDuration: '200ms',
  },
  cardSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.primaryLight,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconCircleDefault: {
    backgroundColor: '#EBE2D5',
  },
  iconCircleActive: {
    backgroundColor: '#DFCEBD',
  },
  emoji: {
    fontSize: 22,
  },
  headerInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.textPrimary,
  },
  cardTagline: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  radioDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Theme.colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioDotActive: {
    borderColor: Theme.colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Theme.colors.primary,
  },
  cardDescription: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    lineHeight: 18,
  },
});
