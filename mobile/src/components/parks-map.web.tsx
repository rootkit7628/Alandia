import { Link } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { spacing, usePalette } from '@/lib/theme';
import type { Park } from '@/lib/types';

/** react-native-maps has no web version: list the parks with a link to OpenStreetMap instead. */
export function ParksMap({ parks }: { parks: Park[] }) {
  const palette = usePalette();

  return (
    <FlatList
      data={parks}
      keyExtractor={(park) => String(park.id)}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <Text style={[styles.note, { color: palette.textMuted }]}>
          La carte interactive est disponible dans l&apos;app mobile. Sur le web, chaque parc
          s&apos;ouvre dans OpenStreetMap.
        </Text>
      }
      renderItem={({ item }) => (
        <View style={[styles.row, { borderColor: palette.border }]}>
          <Link
            href={{ pathname: '/park/[id]', params: { id: item.id } }}
            style={[styles.name, { color: palette.text }]}
          >
            {item.name}
          </Link>
          <Link
            href={`https://www.openstreetmap.org/?mlat=${item.latitude}&mlon=${item.longitude}#map=11/${item.latitude}/${item.longitude}`}
            target="_blank"
            style={{ color: palette.primary }}
          >
            Carte ↗
          </Link>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg },
  note: { fontSize: 14, marginBottom: spacing.md },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  name: { flex: 1, fontSize: 15 },
});
