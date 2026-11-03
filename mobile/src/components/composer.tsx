import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/lib/auth';
import { radius, spacing, usePalette } from '@/lib/theme';

type Props = {
  placeholder: string;
  maxLength: number;
  /** Throws on failure; the message is shown under the field. */
  onSend: (text: string, token: string) => Promise<void>;
};

/** A text field with a send button, or an invitation to log in. */
export function Composer({ placeholder, maxLength, onSend }: Props) {
  const palette = usePalette();
  const { session } = useAuth();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>();

  if (!session) {
    return (
      <Link href="/account" style={[styles.login, { color: palette.primary }]}>
        Connecte-toi pour participer
      </Link>
    );
  }

  const send = async () => {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    setError(undefined);
    try {
      await onSend(body, session.token);
      setText('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.box, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={palette.textMuted}
          maxLength={maxLength}
          multiline
          style={[styles.input, { color: palette.text }]}
        />
        <Pressable
          onPress={send}
          disabled={!text.trim() || sending}
          accessibilityRole="button"
          accessibilityLabel="Envoyer"
          style={[
            styles.send,
            { backgroundColor: palette.primary, opacity: text.trim() ? 1 : 0.4 },
          ]}
        >
          {sending ? (
            <ActivityIndicator color={palette.primaryText} size="small" />
          ) : (
            <Ionicons name="send" size={16} color={palette.primaryText} />
          )}
        </Pressable>
      </View>
      {error && <Text style={{ color: palette.danger, fontSize: 13 }}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  box: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  input: { flex: 1, fontSize: 15, maxHeight: 120, paddingHorizontal: spacing.xs, paddingTop: 6 },
  send: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  login: { fontSize: 15, fontWeight: '600', textAlign: 'center', paddingVertical: spacing.md },
});
