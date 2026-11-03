import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { usePalette } from '@/lib/theme';

type Props = {
  value: number | null;
  size?: number;
  /** When set, the stars become buttons that pick a score from 1 to 5. */
  onChange?: (score: number) => void;
};

export function Stars({ value, size = 14, onChange }: Props) {
  const palette = usePalette();
  const score = value ?? 0;

  return (
    <View style={styles.row} accessibilityLabel={value ? `${value} sur 5` : 'Pas encore noté'}>
      {[1, 2, 3, 4, 5].map((n) => {
        const name = score >= n ? 'star' : score >= n - 0.5 ? 'star-half' : 'star-outline';
        const icon = <Ionicons name={name} size={size} color={palette.star} />;
        return onChange ? (
          <Pressable
            key={n}
            onPress={() => onChange(n)}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`Donner ${n} sur 5`}
          >
            {icon}
          </Pressable>
        ) : (
          <View key={n}>{icon}</View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 2 },
});
