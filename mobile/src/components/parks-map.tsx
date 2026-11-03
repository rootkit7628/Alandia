import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { usePalette } from '@/lib/theme';
import type { Park } from '@/lib/types';

// Frames the whole island, from Antsiranana in the north to Taolagnaro in the south.
const MADAGASCAR = {
  latitude: -18.9,
  longitude: 46.9,
  latitudeDelta: 15,
  longitudeDelta: 11,
};

export function ParksMap({ parks }: { parks: Park[] }) {
  const palette = usePalette();

  return (
    <MapView style={StyleSheet.absoluteFill} initialRegion={MADAGASCAR}>
      {parks.map((park) => (
        <Marker
          key={park.id}
          coordinate={{ latitude: park.latitude, longitude: park.longitude }}
          title={park.name}
          description={`${park.province.name} · voir la fiche`}
          pinColor={palette.primary}
          onCalloutPress={() => router.push({ pathname: '/park/[id]', params: { id: park.id } })}
        />
      ))}
    </MapView>
  );
}
