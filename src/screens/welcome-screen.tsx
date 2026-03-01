import { StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Badge,
  Button,
  Card,
  Chip,
  HStack,
  Screen,
  Stack,
  Tag,
} from '@/components';
import { AppRoute } from '@/navigation/routes';
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
      <Stack spacing="md" style={styles.page}>
        <AppBar title="Hyfe Native" subtitle={t('welcome.kicker')} />

        <Card elevation="md" style={styles.heroCard}>
          <Stack spacing="sm">
            <Stack spacing="xs" style={styles.heroTextWrap}>
              <Text style={styles.title}>{t('welcome.title')}</Text>
              <Text style={styles.subtitle}>{t('welcome.subtitle')}</Text>
            </Stack>

            <HStack spacing="xs" style={styles.wrap}>
              <Badge label="React Native 0.84" variant="" />
              <Tag label="Design System" icon="palette-outline" />
              <Tag label="Theme Aware" icon="theme-light-dark" />
            </HStack>

            <HStack spacing="sm">
              <Button
                title={t('welcome.toLogin')}
                onPress={() => navigation.navigate(AppRoute.Login)}
                fullWidth
              />
              <Button
                title="Open UI Demo"
                variant="secondary"
                onPress={() => navigation.navigate(AppRoute.UiDemo)}
                fullWidth
              />
            </HStack>
          </Stack>
        </Card>

        <Card>
          <Stack spacing="sm">
            <Text style={styles.sectionTitle}>{t('welcome.cardTitle')}</Text>
            <Text style={styles.point}>{t('welcome.point1')}</Text>
            <Text style={styles.point}>{t('welcome.point2')}</Text>
            <Text style={styles.point}>{t('welcome.point3')}</Text>
          </Stack>
        </Card>

        <Card>
          <Stack spacing="sm">
            <Text style={styles.sectionTitle}>{t('welcome.themeMode')}</Text>
            <HStack spacing="xs" style={styles.wrap}>
              {THEME_OPTIONS.map(option => (
                <Chip
                  key={option}
                  label={option.toUpperCase()}
                  selected={option === preference}
                  onPress={() => setPreference(option)}
                />
              ))}
            </HStack>

            <Text style={styles.sectionTitle}>{t('welcome.fontScale')}</Text>
            <HStack spacing="xs" style={styles.wrap}>
              {FONT_SCALE_OPTIONS.map(option => (
                <Chip
                  key={option}
                  label={option.toUpperCase()}
                  selected={option === fontScalePreference}
                  onPress={() => setFontScalePreference(option)}
                />
              ))}
            </HStack>

            <Text style={styles.sectionTitle}>{t('welcome.language')}</Text>
            <HStack spacing="xs" style={styles.wrap}>
              {LANGUAGE_OPTIONS.map(option => (
                <Chip
                  key={option}
                  label={option.toUpperCase()}
                  selected={option === language}
                  onPress={() => setLanguage(option)}
                />
              ))}
            </HStack>
          </Stack>
        </Card>
      </Stack>
    </Screen>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    page: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    heroCard: {
      borderColor: theme.colors.primary,
    },
    heroTop: {
      alignItems: 'flex-start',
    },
    heroTextWrap: {
      flex: 1,
    },
    title: {
      color: theme.colors.text,
      ...theme.typography.h1,
    },
    subtitle: {
      color: theme.colors.textMuted,
      ...theme.typography.bodySm,
    },
    sectionTitle: {
      color: theme.colors.text,
      ...theme.typography.label,
    },
    point: {
      color: theme.colors.textMuted,
      ...theme.typography.bodySm,
    },
    wrap: {
      flexWrap: 'wrap',
    },
  });
