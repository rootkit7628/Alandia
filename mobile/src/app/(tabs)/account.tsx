import { Image } from 'expo-image';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { API_URL } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { radius, spacing, usePalette } from '@/lib/theme';

type Mode = 'login' | 'register';

export default function AccountScreen() {
  const palette = usePalette();
  const { session, ready, logout } = useAuth();

  if (!ready) {
    return <ActivityIndicator style={{ flex: 1 }} color={palette.primary} />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
        <Image source={require('../../../assets/logo.png')} style={styles.logo} />
        {session ? (
          <View style={styles.block}>
            <Text style={[styles.title, { color: palette.text }]}>
              Salut {session.user.pseudo} !
            </Text>
            <Text style={[styles.text, { color: palette.textMuted }]}>
              Tu peux noter les parcs, les commenter et écrire sur le forum.
            </Text>
            <Button label="Se déconnecter" onPress={logout} variant="outline" />
          </View>
        ) : (
          <AuthForm />
        )}
        <About />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function AuthForm() {
  const palette = usePalette();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const submit = async () => {
    setBusy(true);
    setError(undefined);
    try {
      if (mode === 'login') await login(pseudo.trim(), password);
      else await register(pseudo.trim(), email.trim(), password);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const fieldStyle = [
    styles.field,
    { color: palette.text, backgroundColor: palette.surface, borderColor: palette.border },
  ];

  return (
    <View style={styles.block}>
      <Text style={[styles.title, { color: palette.text }]}>
        {mode === 'login' ? 'Connexion' : 'Créer un compte'}
      </Text>
      <TextInput
        value={pseudo}
        onChangeText={setPseudo}
        placeholder={mode === 'login' ? 'Pseudo ou email' : 'Pseudo'}
        placeholderTextColor={palette.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="username"
        style={fieldStyle}
      />
      {mode === 'register' && (
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={palette.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          style={fieldStyle}
        />
      )}
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder={mode === 'login' ? 'Mot de passe' : 'Mot de passe (8 caractères minimum)'}
        placeholderTextColor={palette.textMuted}
        secureTextEntry
        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        onSubmitEditing={submit}
        style={fieldStyle}
      />
      {error && <Text style={{ color: palette.danger }}>{error}</Text>}
      <Button
        label={mode === 'login' ? 'Se connecter' : "S'inscrire"}
        onPress={submit}
        busy={busy}
      />
      <Pressable onPress={() => setMode(mode === 'login' ? 'register' : 'login')} hitSlop={8}>
        <Text style={[styles.switch, { color: palette.primary }]}>
          {mode === 'login' ? 'Pas encore de compte ? Inscris-toi' : 'Déjà inscrit ? Connecte-toi'}
        </Text>
      </Pressable>
    </View>
  );
}

function About() {
  const palette = usePalette();
  return (
    <View style={[styles.about, { borderTopColor: palette.border }]}>
      <Text style={[styles.aboutTitle, { color: palette.text }]}>À propos</Text>
      <Text style={[styles.text, { color: palette.textMuted }]}>
        Alandia aide à découvrir les parcs nationaux et réserves de Madagascar. Né lors d&apos;un
        hackathon en 2020, refait en 2026. Photos et résumés : Wikipédia (CC BY-SA).
      </Text>
      <Text
        style={[styles.small, { color: palette.textMuted }]}
        onPress={() => Linking.openURL(`${API_URL}/api/health`)}
      >
        Serveur : {API_URL}
      </Text>
    </View>
  );
}

function Button({
  label,
  onPress,
  busy,
  variant = 'solid',
}: {
  label: string;
  onPress: () => void;
  busy?: boolean;
  variant?: 'solid' | 'outline';
}) {
  const palette = usePalette();
  const solid = variant === 'solid';
  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: solid ? palette.primary : 'transparent',
          borderColor: palette.primary,
          opacity: pressed || busy ? 0.7 : 1,
        },
      ]}
    >
      {busy ? (
        <ActivityIndicator color={solid ? palette.primaryText : palette.primary} />
      ) : (
        <Text style={[styles.buttonText, { color: solid ? palette.primaryText : palette.primary }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { padding: spacing.xl, gap: spacing.xl, flexGrow: 1 },
  logo: { width: 96, height: 96, alignSelf: 'center' },
  block: { gap: spacing.md },
  title: { fontSize: 22, fontWeight: '700' },
  text: { fontSize: 15, lineHeight: 21 },
  field: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
  },
  button: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: 'center',
  },
  buttonText: { fontSize: 16, fontWeight: '600' },
  switch: { textAlign: 'center', fontSize: 14, fontWeight: '600' },
  about: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: spacing.lg, gap: spacing.sm },
  aboutTitle: { fontSize: 16, fontWeight: '700' },
  small: { fontSize: 12 },
});
