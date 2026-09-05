import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import { PlayStyle } from '../types/survey';
import { playSelect } from '../utils/sound';

interface PlayStyleSelectorProps {
  value: PlayStyle | null;
  onSelect: (val: PlayStyle) => void;
}

export const PlayStyleSelector: React.FC<PlayStyleSelectorProps> = ({
  value,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {/* Option 1: Casual */}
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={() => {
          playSelect();
          onSelect('casual');
        }}
        style={[
          styles.card,
          value === 'casual' && styles.cardSelected,
        ]}
      >
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.iconCircle,
              value === 'casual' ? styles.iconCircleCasualActive : styles.iconCircleCasual,
            ]}
          >
            <Text style={styles.emoji}>🌸</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.cardTitle}>Casual</Text>
            <Text style={styles.cardTagline}>Chill, Hangout & Relax</Text>
          </View>
          <View style={[styles.radioDot, value === 'casual' && styles.radioDotActive]}>
            {value === 'casual' && <View style={styles.radioInner} />}
          </View>
        </View>

        <Text style={styles.cardDescription}>
          Play with us casually! Fun squad runs, cozy voice channels, weekend games, and zero pressure.
        </Text>

        <View style={styles.tagRow}>
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>🍵 Cozy Vibes</Text>
          </View>
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>🎉 Clan Hangouts</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Option 2: Competitive */}
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={() => {
          playSelect();
          onSelect('competitive');
        }}
        style={[
          styles.card,
          value === 'competitive' && styles.cardSelected,
        ]}
      >
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.iconCircle,
              value === 'competitive' ? styles.iconCircleCompActive : styles.iconCircleComp,
            ]}
          >
            <Text style={styles.emoji}>⚔️</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.cardTitle}>Competitive</Text>
            <Text style={styles.cardTagline}>Frontline & Fight for Honor</Text>
          </View>
          <View style={[styles.radioDot, value === 'competitive' && styles.radioDotActive]}>
            {value === 'competitive' && <View style={styles.radioInner} />}
          </View>
        </View>

        <Text style={styles.cardDescription}>
          Go on the frontline and fight for our honor! Tournaments, ranked climb, scrims, and victory!
        </Text>

        <View style={styles.tagRow}>
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>🛡️ Frontline Vanguard</Text>
          </View>
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>🏆 Glory & Rank</Text>
          </View>
        </View>
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
  iconCircleCasual: {
    backgroundColor: '#F7E7E2',
  },
  iconCircleCasualActive: {
    backgroundColor: '#EED3CB',
  },
  iconCircleComp: {
    backgroundColor: '#EAE1D7',
  },
  iconCircleCompActive: {
    backgroundColor: '#DECDBF',
  },
  emoji: {
    fontSize: 22,
  },
  headerInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
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
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgePill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Theme.radii.full,
    borderWidth: 1,
    borderColor: Theme.colors.cardBorder,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
});
