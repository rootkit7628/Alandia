import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatRating, radius, spacing, usePalette } from '@/lib/theme';
import type { Park } from '@/lib/types';

import { ParkImage } from './park-image';
import { Stars } from './stars';

export function ParkCard({ park }: { park: Park }) {
  const palette = usePalette();

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/park/[id]', params: { id: park.id } })}
      accessibilityRole="link"
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: palette.surface, borderColor: palette.border },
        pressed && { opacity: 0.85 },
      ]}
    >
      <ParkImage page={park.wikipedia} style={styles.image} />
      <View style={styles.body}>
        <Text style={[styles.name, { color: palette.text }]} numberOfLines={2}>
          {park.name}
        </Text>
        <Text style={[styles.province, { color: palette.primary }]}>{park.province.name}</Text>
        <Text style={[styles.description, { color: palette.textMuted }]} numberOfLines={2}>
          {park.description}
        </Text>
        <View style={styles.rating}>
          <Stars value={park.rating} />
          <Text style={[styles.count, { color: palette.textMuted }]}>
            {park.rating_count > 0
              ? `${formatRating(park.rating)} · ${park.rating_count} avis`
              : 'Aucun avis'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  image: { width: 104 },
  body: { flex: 1, padding: spacing.md, gap: 3 },
  name: { fontSize: 15, fontWeight: '700' },
  province: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  description: { fontSize: 13, lineHeight: 18 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 2 },
  count: { fontSize: 12 },
});
