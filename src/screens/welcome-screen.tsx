import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppRoute } from '@/navigation/routes';
import { Screen } from '@/components/screen';
import { themeStoreSelectors, useThemeStore, useThemeValue } from '@/theme';
import type { Theme, ThemeFontScalePreference, ThemePreference } from '@/theme';
import type { RootStackScreenProps } from '@/navigation/navigation-types';

type Props = RootStackScreenProps<AppRoute.Welcome>;

const THEME_OPTIONS: ThemePreference[] = ['light', 'dark', 'system'];
const FONT_SCALE_OPTIONS: ThemeFontScalePreference[] = [
  'small',
  'medium',
  'large',
  'system',
];

export function WelcomeScreen({ navigation }: Props) {
  const theme = useThemeValue();
  const preference = useThemeStore(themeStoreSelectors.preference);
  const fontScalePreference = useThemeStore(
    themeStoreSelectors.fontScalePreference,
  );
  const setPreference = useThemeStore(themeStoreSelectors.setPreference);
  const setFontScalePreference = useThemeStore(
    themeStoreSelectors.setFontScalePreference,
  );
  const styles = createStyles(theme);

  return (
    <Screen scroll>
      <View style={styles.page}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>
            Hyfenative - React Native Boilerplate
          </Text>
          <Text style={styles.title}>
            Build Faster With A Clean React Native Stack
          </Text>
          <Text style={styles.subtitle}>
            Ky-powered API contracts, schema validation, persistent query cache,
            and MMKV-ready auth flows.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What is wired</Text>
          <Text style={styles.point}>
            1. Typed API helpers with Zod schema checks
          </Text>
          <Text style={styles.point}>
            2. Request/response key case transformation
          </Text>
          <Text style={styles.point}>
            3. Normalized API errors + auth token persistence
          </Text>

          <Text style={styles.themeSectionTitle}>Theme mode</Text>
          <View style={styles.themeRow}>
            {THEME_OPTIONS.map(option => {
              const isSelected = option === preference;
              return (
                <Pressable
                  key={option}
                  onPress={() => setPreference(option)}
                  style={[
                    styles.themeOption,
                    isSelected && styles.themeOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.themeOptionText,
                      isSelected && styles.themeOptionTextSelected,
                    ]}
                  >
                    {option.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.themeSectionTitle}>Font scale</Text>
          <View style={styles.themeRow}>
            {FONT_SCALE_OPTIONS.map(option => {
              const isSelected = option === fontScalePreference;
              return (
                <Pressable
                  key={option}
                  onPress={() => setFontScalePreference(option)}
                  style={[
                    styles.themeOption,
                    isSelected && styles.themeOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.themeOptionText,
                      isSelected && styles.themeOptionTextSelected,
                    ]}
                  >
                    {option.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text
            style={styles.link}
            onPress={() => navigation.navigate(AppRoute.Login)}
          >
            Continue to login
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    page: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
      justifyContent: 'space-between',
      backgroundColor: theme.colors.background,
      gap: theme.spacing.lg,
    },
    hero: {
      gap: theme.spacing.sm,
    },
    kicker: {
      color: theme.colors.primary,
      ...theme.typography.kicker,
    },
    title: {
      color: theme.colors.text,
      ...theme.typography.h1,
    },
    subtitle: {
      color: theme.colors.textMuted,
      ...theme.typography.body,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      gap: theme.spacing.xs,
    },
    cardTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.body.fontSize + theme.spacing.xs / 4,
      fontWeight: theme.typography.kicker.fontWeight,
      marginBottom: theme.spacing.xs / 2,
    },
    point: {
      color: theme.colors.textMuted,
      ...theme.typography.bodySm,
    },
    themeSectionTitle: {
      marginTop: theme.spacing.sm,
      color: theme.colors.text,
      ...theme.typography.label,
    },
    themeRow: {
      flexDirection: 'row',
      gap: theme.spacing.xs,
      marginTop: theme.spacing.xs / 2,
    },
    themeOption: {
      flex: 1,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      borderColor: theme.colors.borderStrong,
      paddingVertical: theme.spacing.xs,
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceAlt,
    },
    themeOptionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryMuted,
    },
    themeOptionText: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.kicker.fontSize,
      fontWeight: theme.typography.kicker.fontWeight,
    },
    themeOptionTextSelected: {
      color: theme.colors.accent,
    },
    link: {
      color: theme.colors.primary,
      marginTop: theme.spacing.sm,
      fontSize: theme.typography.label.fontSize,
      fontWeight: theme.typography.label.fontWeight,
    },
    blankSpace: {
      flex: 1,
    },
  });
