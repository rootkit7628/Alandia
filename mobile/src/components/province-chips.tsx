import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { radius, spacing, usePalette } from '@/lib/theme';
import type { Province } from '@/lib/types';

type Props = {
  provinces: Province[];
  selected: number | null;
  onSelect: (id: number | null) => void;
};

export function ProvinceChips({ provinces, selected, onSelect }: Props) {
  const palette = usePalette();
  const items: { id: number | null; label: string }[] = [
    { id: null, label: 'Toutes' },
    ...provinces.map((p) => ({ id: p.id, label: `${p.name} (${p.park_count})` })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {items.map((item) => {
        const active = item.id === selected;
        return (
          <Pressable
            key={item.id ?? 'all'}
            onPress={() => onSelect(item.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[
              styles.chip,
              { borderColor: active ? palette.primary : palette.border },
              { backgroundColor: active ? palette.primary : palette.surface },
            ]}
          >
            <Text style={{ color: active ? palette.primaryText : palette.text, fontSize: 13 }}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm, paddingHorizontal: spacing.lg },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
});
