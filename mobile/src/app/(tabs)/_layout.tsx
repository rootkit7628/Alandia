import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';

import { usePalette } from '@/lib/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

const TABS: { name: string; title: string; icon: IconName }[] = [
  { name: 'index', title: 'Parcs', icon: 'leaf' },
  { name: 'map', title: 'Carte', icon: 'map' },
  { name: 'forum', title: 'Forum', icon: 'chatbubbles' },
  { name: 'account', title: 'Compte', icon: 'person-circle' },
];

export default function TabLayout() {
  const palette = usePalette();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.textMuted,
        tabBarStyle: { backgroundColor: palette.surface, borderTopColor: palette.border },
        headerStyle: { backgroundColor: palette.surface },
        headerTitleStyle: { color: palette.text },
        sceneStyle: { backgroundColor: palette.background },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            headerTitle: tab.name === 'index' ? 'Alandia' : tab.title,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={tab.icon} size={size} color={String(color)} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
