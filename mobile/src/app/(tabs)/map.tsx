import { View } from 'react-native';

import { ParksMap } from '@/components/parks-map';
import { ErrorState, Loading } from '@/components/states';
import { api } from '@/lib/api';
import { useAsync } from '@/lib/use-async';

export default function MapScreen() {
  const parks = useAsync(() => api.parks(), []);

  if (parks.error) return <ErrorState error={parks.error} onRetry={parks.reload} />;
  if (!parks.data) return <Loading />;
  return (
    <View style={{ flex: 1 }}>
      <ParksMap parks={parks.data} />
    </View>
  );
}
