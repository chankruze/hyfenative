import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

type Props = {
  error: Error;
  onRetry: () => Promise<void>;
};

export const ErrorFallback = ({ error, onRetry }: Props) => {
  const handleRetryPress = () => {
    onRetry().catch(retryError => {
      console.error('Retry from error boundary failed', retryError);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong.</Text>

      <Text style={styles.message}>
        {__DEV__ ? error.message : 'Please try again.'}
      </Text>

      <Button title="Try again" onPress={handleRetryPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#0B1220',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#F8FAFC',
  },
  message: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#CBD5E1',
  },
});
