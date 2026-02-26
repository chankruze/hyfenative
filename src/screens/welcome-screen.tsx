import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppRoute } from '@/navigation/routes';
import type { RootStackScreenProps } from '@/navigation/navigation-types';

type Props = RootStackScreenProps<AppRoute.Welcome>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.page}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Hyfen React Native Boilerplate</Text>
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
          <Text style={styles.point}>1. Typed API helpers with Zod schema checks</Text>
          <Text style={styles.point}>
            2. Request/response key case transformation
          </Text>
          <Text style={styles.point}>
            3. Normalized API errors + auth token persistence
          </Text>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate(AppRoute.Login)}
          >
            Go to login placeholder
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0B1220',
  },
  page: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    justifyContent: 'space-between',
    backgroundColor: '#0B1220',
  },
  hero: {
    marginTop: 20,
    gap: 12,
  },
  kicker: {
    color: '#67E8F9',
    fontSize: 12,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#111A2D',
    borderColor: '#1E293B',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  point: {
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    color: '#67E8F9',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});
