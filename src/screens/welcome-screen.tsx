import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppRoute } from '@/navigation/routes';
import { Avatar, IconByVariant, Screen } from '@/components';
import { useThemePreferences, useThemeValue } from '@/theme';
import type { Theme, ThemeFontScalePreference, ThemePreference } from '@/theme';
import {
  languageStoreSelectors,
  useLanguageStore,
} from '@/stores/use-language-store';
import type { AppLanguage } from '@/i18n/resources';
import type { RootStackScreenProps } from '@/navigation/navigation-types';

type Props = RootStackScreenProps<AppRoute.Welcome>;

const THEME_OPTIONS: ThemePreference[] = ['light', 'dark', 'system'];
const FONT_SCALE_OPTIONS: ThemeFontScalePreference[] = [
  'small',
  'medium',
  'large',
  'system',
];
const LANGUAGE_OPTIONS: AppLanguage[] = ['en', 'hi'];

export function WelcomeScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const theme = useThemeValue();
  const language = useLanguageStore(languageStoreSelectors.language);
  const setLanguage = useLanguageStore(languageStoreSelectors.setLanguage);
  const {
    preference,
    fontScalePreference,
    setPreference,
    setFontScalePreference,
  } = useThemePreferences();
  const styles = createStyles(theme);

  return (
    <Screen scroll>
      <View style={styles.page}>
        <View style={styles.hero}>
          <Avatar
            name="Hyfe Native"
            fallback="HN"
            variant="primary"
            size="lg"
            style={styles.heroAvatar}
          />
          <Text style={styles.kicker}>{t('welcome.kicker')}</Text>
          <Text style={styles.title}>{t('welcome.title')}</Text>
          <Text style={styles.subtitle}>{t('welcome.subtitle')}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('welcome.cardTitle')}</Text>
          <Text style={styles.point}>{t('welcome.point1')}</Text>
          <Text style={styles.point}>{t('welcome.point2')}</Text>
          <Text style={styles.point}>{t('welcome.point3')}</Text>

          <Text style={styles.themeSectionTitle}>{t('welcome.themeMode')}</Text>
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
                  <View style={styles.themeOptionContent}>
                    <IconByVariant
                      name={isSelected ? 'check-circle' : 'radiobox-blank'}
                      size="sm"
                      variant={isSelected ? 'primary' : 'secondary'}
                    />
                    <Text
                      style={[
                        styles.themeOptionText,
                        isSelected && styles.themeOptionTextSelected,
                      ]}
                    >
                      {option.toUpperCase()}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.themeSectionTitle}>{t('welcome.fontScale')}</Text>
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
                  <View style={styles.themeOptionContent}>
                    <IconByVariant
                      name={isSelected ? 'check-circle' : 'radiobox-blank'}
                      size="sm"
                      variant={isSelected ? 'primary' : 'secondary'}
                    />
                    <Text
                      style={[
                        styles.themeOptionText,
                        isSelected && styles.themeOptionTextSelected,
                      ]}
                    >
                      {option.toUpperCase()}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.themeSectionTitle}>{t('welcome.language')}</Text>
          <View style={styles.themeRow}>
            {LANGUAGE_OPTIONS.map(option => {
              const isSelected = option === language;
              return (
                <Pressable
                  key={option}
                  onPress={() => setLanguage(option)}
                  style={[
                    styles.themeOption,
                    isSelected && styles.themeOptionSelected,
                  ]}
                >
                  <View style={styles.themeOptionContent}>
                    <IconByVariant
                      name={isSelected ? 'check-circle' : 'radiobox-blank'}
                      size="sm"
                      variant={isSelected ? 'primary' : 'secondary'}
                    />
                    <Text
                      style={[
                        styles.themeOptionText,
                        isSelected && styles.themeOptionTextSelected,
                      ]}
                    >
                      {option.toUpperCase()}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Text
            style={styles.link}
            onPress={() => navigation.navigate(AppRoute.Login)}
          >
            {t('welcome.toLogin')}
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
    heroAvatar: {
      marginBottom: theme.spacing.xs / 2,
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
    themeOptionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs / 2,
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
