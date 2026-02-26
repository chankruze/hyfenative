import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
import type { Theme } from '@/theme';

type Props = {
  error: Error;
  onRetry: () => Promise<void>;
};

export const ErrorFallback = ({ error, onRetry }: Props) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

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

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: theme.spacing.sm,
      color: theme.colors.text,
    },
    message: {
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
      color: theme.colors.textMuted,
    },
  });
