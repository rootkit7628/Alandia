import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from '@/lib/auth';
import { usePalette } from '@/lib/theme';

export default function RootLayout() {
  const palette = usePalette();

  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: palette.surface },
          headerTintColor: palette.primary,
          headerTitleStyle: { color: palette.text },
          contentStyle: { backgroundColor: palette.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="park/[id]" options={{ title: '', headerBackTitle: 'Retour' }} />
      </Stack>
    </AuthProvider>
  );
}
