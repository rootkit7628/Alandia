import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, spacing, usePalette } from '@/lib/theme';

export function Loading() {
  const palette = usePalette();
  return (
    <View style={styles.center}>
      <ActivityIndicator color={palette.primary} />
    </View>
  );
}

export function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  const palette = usePalette();
  return (
    <View style={styles.center}>
      <Ionicons name="cloud-offline-outline" size={36} color={palette.textMuted} />
      <Text style={[styles.message, { color: palette.text }]}>{error.message}</Text>
      <Pressable
        onPress={onRetry}
        style={[styles.button, { backgroundColor: palette.primary }]}
        accessibilityRole="button"
      >
        <Text style={{ color: palette.primaryText, fontWeight: '600' }}>Réessayer</Text>
      </Pressable>
    </View>
  );
}

export function Empty({ message }: { message: string }) {
  const palette = usePalette();
  return (
    <View style={styles.center}>
      <Ionicons name="leaf-outline" size={32} color={palette.textMuted} />
      <Text style={[styles.message, { color: palette.textMuted }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  message: { fontSize: 15, textAlign: 'center' },
  button: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.lg },
});
