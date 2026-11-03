import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { usePalette } from '@/lib/theme';
import type { WikipediaPage } from '@/lib/types';
import { useWikiSummary } from '@/lib/wikipedia';

type Props = { page: WikipediaPage | null; style?: StyleProp<ViewStyle>; iconSize?: number };

/** The park's Wikipedia photo, or a leaf on a green background when there is none. */
export function ParkImage({ page, style, iconSize = 28 }: Props) {
  const palette = usePalette();
  const summary = useWikiSummary(page);

  return (
    <View style={[styles.frame, { backgroundColor: palette.surfaceMuted }, style]}>
      {summary?.image ? (
        <Image
          source={summary.image}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <Ionicons name="leaf" size={iconSize} color={palette.primary} style={{ opacity: 0.5 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
});
