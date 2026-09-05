import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Platform, Image } from 'react-native';
import { Theme } from '../constants/theme';

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.title = "Exalted Clan • Interview Assistant";
      // Set html and body background to cozy brownish-white
      document.documentElement.style.backgroundColor = Theme.colors.bgBase;
      document.body.style.backgroundColor = Theme.colors.bgBase;
      document.body.style.margin = '0';
      document.body.style.fontFamily =
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

      try {
        const faviconUri = Image.resolveAssetSource(require('../../assets/images/favicon.png'))?.uri || '/assets/images/favicon.png';
        const iconUri = Image.resolveAssetSource(require('../../assets/images/icon.png'))?.uri || '/assets/images/icon.png';

        // Set Interview Assistant favicon dynamically
        let favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!favicon) {
          favicon = document.createElement('link');
          favicon.rel = 'icon';
          document.head.appendChild(favicon);
        }
        favicon.href = faviconUri;

        let appleIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
        if (!appleIcon) {
          appleIcon = document.createElement('link');
          appleIcon.rel = 'apple-touch-icon';
          document.head.appendChild(appleIcon);
        }
        appleIcon.href = iconUri;
      } catch {
        // fallback
      }
    }
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Theme.colors.bgBase,
        },
      }}
    />
  );
}
