import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import { isSoundEnabled, toggleSound } from '../utils/sound';

export const SoundToggle: React.FC = () => {
  const [enabled, setEnabled] = useState(isSoundEnabled());

  const handleToggle = () => {
    const nextState = toggleSound();
    setEnabled(nextState);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handleToggle}
      style={[
        styles.button,
        enabled ? styles.buttonActive : styles.buttonMuted,
      ]}
      accessibilityLabel={enabled ? 'Mute sound effects' : 'Enable sound effects'}
    >
      <Ionicons
        name={enabled ? 'volume-high' : 'volume-mute'}
        size={16}
        color={enabled ? Theme.colors.primary : Theme.colors.textMuted}
      />
      <Text
        style={[
          styles.text,
          { color: enabled ? Theme.colors.primary : Theme.colors.textMuted },
        ]}
      >
        {enabled ? 'SFX ON' : 'SFX OFF'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Theme.radii.full,
    borderWidth: 1,
    gap: 6,
  },
  buttonActive: {
    backgroundColor: Theme.colors.primaryLight,
    borderColor: Theme.colors.cardBorderHover,
  },
  buttonMuted: {
    backgroundColor: Theme.colors.bgSecondary,
    borderColor: Theme.colors.cardBorder,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
