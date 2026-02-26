import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function LoginScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.page}>
        <Text style={styles.title}>Login Screen</Text>
        <Text style={styles.subtitle}>
          Placeholder route is wired. Add your UI next.
        </Text>
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
    justifyContent: 'center',
    backgroundColor: '#0B1220',
    gap: 12,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 16,
    lineHeight: 24,
  },
});
