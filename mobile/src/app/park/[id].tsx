import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { type ComponentProps, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Composer } from '@/components/composer';
import { ParkImage } from '@/components/park-image';
import { Stars } from '@/components/stars';
import { ErrorState, Loading } from '@/components/states';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatDate, formatRating, radius, spacing, usePalette } from '@/lib/theme';
import type { ParkDetail } from '@/lib/types';
import { useAsync } from '@/lib/use-async';
import { useWikiSummary } from '@/lib/wikipedia';

export default function ParkScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const parkId = Number(id);
  const park = useAsync(() => api.park(parkId), [parkId]);

  if (park.error) return <ErrorState error={park.error} onRetry={park.reload} />;
  if (!park.data) return <Loading />;
  return <ParkContent park={park.data} update={(p) => park.setData((c) => (c ? p(c) : c))} />;
}

function ParkContent({
  park,
  update,
}: {
  park: ParkDetail;
  update: (change: (park: ParkDetail) => ParkDetail) => void;
}) {
  const palette = usePalette();
  const wiki = useWikiSummary(park.wikipedia);

  const openMaps = () => {
    const { latitude: lat, longitude: lon } = park;
    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${lat},${lon}&q=${encodeURIComponent(park.name)}`,
      android: `geo:${lat},${lon}?q=${lat},${lon}(${encodeURIComponent(park.name)})`,
      default: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=11/${lat}/${lon}`,
    });
    Linking.openURL(url);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <Stack.Screen options={{ title: park.name }} />
      <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
        <ParkImage page={park.wikipedia} style={styles.hero} iconSize={56} />

        <View style={styles.section}>
          <Text style={[styles.province, { color: palette.primary }]}>{park.province.name}</Text>
          <Text style={[styles.name, { color: palette.text }]}>{park.name}</Text>
          <View style={styles.ratingRow}>
            <Stars value={park.rating} size={18} />
            <Text style={{ color: palette.textMuted }}>
              {park.rating_count > 0
                ? `${formatRating(park.rating)} / 5 · ${park.rating_count} avis`
                : 'Aucun avis pour le moment'}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          {park.phone && (
            <Action
              icon="call"
              label="Appeler"
              onPress={() => Linking.openURL(`tel:${park.phone}`)}
            />
          )}
          <Action icon="navigate" label="Itinéraire" onPress={openMaps} />
          {park.wikipedia && (
            <Action
              icon="book"
              label="Wikipédia"
              onPress={() => Linking.openURL(park.wikipedia!.url)}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.heading, { color: palette.text }]}>Présentation</Text>
          <Text style={[styles.text, { color: palette.text }]}>{park.description}</Text>
          {wiki?.extract && (
            <Text style={[styles.text, { color: palette.textMuted }]}>
              {wiki.extract}
              {'  '}
              <Text style={{ fontStyle: 'italic' }}>(Wikipédia)</Text>
            </Text>
          )}
        </View>

        <MyRating parkId={park.id} onRated={(r) => update((p) => ({ ...p, ...r }))} />

        <View style={styles.section}>
          <Text style={[styles.heading, { color: palette.text }]}>
            Commentaires ({park.comments.length})
          </Text>
          <Composer
            placeholder="Partage ton expérience…"
            maxLength={500}
            onSend={async (text, token) => {
              const comment = await api.comment(park.id, text, token);
              update((p) => ({ ...p, comments: [comment, ...p.comments] }));
            }}
          />
          {park.comments.map((c) => (
            <View
              key={c.id}
              style={[
                styles.comment,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}
            >
              <Text style={{ color: palette.primary, fontWeight: '700' }}>{c.author}</Text>
              <Text style={[styles.text, { color: palette.text }]}>{c.body}</Text>
              <Text style={{ color: palette.textMuted, fontSize: 12 }}>
                {formatDate(c.created_at)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function MyRating({
  parkId,
  onRated,
}: {
  parkId: number;
  onRated: (r: { rating: number; rating_count: number }) => void;
}) {
  const palette = usePalette();
  const { session } = useAuth();
  const token = session?.token;
  // The score is tied to the token it was loaded with, so logging out hides it at once.
  const [mine, setMine] = useState<{ token: string; score: number | null }>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!token) return;
    let active = true;
    api.myRating(parkId, token).then(
      (score) => active && setMine({ token, score }),
      () => active && setMine({ token, score: null }),
    );
    return () => {
      active = false;
    };
  }, [parkId, token]);

  if (!token) return null;
  const score = mine?.token === token ? mine.score : null;

  const rate = async (value: number) => {
    setMine({ token, score: value });
    setError(undefined);
    try {
      onRated(await api.rate(parkId, value, token));
    } catch (err) {
      setMine({ token, score });
      setError((err as Error).message);
    }
  };

  return (
    <View style={[styles.myRating, { backgroundColor: palette.surfaceMuted }]}>
      <Text style={{ color: palette.text, fontWeight: '600' }}>
        {score ? 'Ta note' : 'Tu es allé·e ici ? Donne ta note'}
      </Text>
      <Stars value={score} size={28} onChange={rate} />
      {error && <Text style={{ color: palette.danger }}>{error}</Text>}
    </View>
  );
}

function Action({
  icon,
  label,
  onPress,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
}) {
  const palette = usePalette();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.action,
        { backgroundColor: palette.surface, borderColor: palette.border },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Ionicons name={icon} size={20} color={palette.primary} />
      <Text style={{ color: palette.text, fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { paddingBottom: spacing.xl * 2, gap: spacing.lg },
  hero: { height: 230 },
  section: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  province: { fontSize: 12, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  name: { fontSize: 24, fontWeight: '800' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  actions: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg },
  action: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  heading: { fontSize: 17, fontWeight: '700' },
  text: { fontSize: 15, lineHeight: 22 },
  myRating: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  comment: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
});
