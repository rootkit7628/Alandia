import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { Composer } from '@/components/composer';
import { Empty, ErrorState, Loading } from '@/components/states';
import { api } from '@/lib/api';
import { formatDate, radius, spacing, usePalette } from '@/lib/theme';
import { useAsync } from '@/lib/use-async';

export default function ForumScreen() {
  const palette = usePalette();
  const posts = useAsync(api.forum, []);

  if (posts.error) return <ErrorState error={posts.error} onRetry={posts.reload} />;
  if (!posts.data) return <Loading />;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={posts.data}
        keyExtractor={(post) => String(post.id)}
        contentContainerStyle={styles.list}
        onRefresh={posts.reload}
        refreshing={posts.loading}
        ListEmptyComponent={<Empty message="Pas encore de message. Lance la discussion !" />}
        renderItem={({ item }) => (
          <View
            style={[styles.post, { backgroundColor: palette.surface, borderColor: palette.border }]}
          >
            <Text style={[styles.author, { color: palette.primary }]}>{item.author}</Text>
            <Text style={[styles.body, { color: palette.text }]}>{item.body}</Text>
            <Text style={[styles.date, { color: palette.textMuted }]}>
              {formatDate(item.created_at)}
            </Text>
          </View>
        )}
      />
      <View style={[styles.composer, { borderTopColor: palette.border }]}>
        <Composer
          placeholder="Pose une question, partage un bon plan…"
          maxLength={800}
          onSend={async (text, token) => {
            const post = await api.post(text, token);
            posts.setData((current) => [post, ...(current ?? [])]);
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { padding: spacing.lg, gap: spacing.md, flexGrow: 1 },
  post: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  author: { fontWeight: '700', fontSize: 14 },
  body: { fontSize: 15, lineHeight: 21 },
  date: { fontSize: 12 },
  composer: { padding: spacing.md, borderTopWidth: StyleSheet.hairlineWidth },
});
