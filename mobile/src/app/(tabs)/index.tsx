import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, TextInput, View } from 'react-native';

import { ParkCard } from '@/components/park-card';
import { ProvinceChips } from '@/components/province-chips';
import { Empty, ErrorState, Loading } from '@/components/states';
import { api } from '@/lib/api';
import { radius, spacing, usePalette } from '@/lib/theme';
import { useAsync } from '@/lib/use-async';

export default function ParksScreen() {
  const palette = usePalette();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [province, setProvince] = useState<number | null>(null);

  // Wait for a pause in typing before querying the API.
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const provinces = useAsync(api.provinces, []);
  const parks = useAsync(() => api.parks({ q: query, province }), [query, province]);

  return (
    <View style={styles.screen}>
      <View style={styles.filters}>
        <View
          style={[styles.search, { backgroundColor: palette.surface, borderColor: palette.border }]}
        >
          <Ionicons name="search" size={18} color={palette.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Rechercher un parc, un animal…"
            placeholderTextColor={palette.textMuted}
            style={[styles.searchInput, { color: palette.text }]}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
        {provinces.data && (
          <ProvinceChips provinces={provinces.data} selected={province} onSelect={setProvince} />
        )}
      </View>

      {parks.error ? (
        <ErrorState error={parks.error} onRetry={parks.reload} />
      ) : parks.loading && !parks.data ? (
        <Loading />
      ) : (
        <FlatList
          data={parks.data}
          keyExtractor={(park) => String(park.id)}
          renderItem={({ item }) => <ParkCard park={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Empty message="Aucun parc ne correspond à ta recherche." />}
          refreshControl={
            <RefreshControl
              refreshing={parks.loading}
              onRefresh={parks.reload}
              tintColor={palette.primary}
            />
          }
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  filters: { paddingTop: spacing.md, gap: spacing.md },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 10 },
  list: { padding: spacing.lg, gap: spacing.md, flexGrow: 1 },
});
