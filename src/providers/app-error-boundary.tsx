import { createContext, ErrorInfo, useCallback, useContext } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { ErrorFallback } from '@/components/error-fallback';
import { reportError } from '@/lib/error-reporting';
import { resetAppState } from '@/lib/reset-app';

type Props = {
  children: React.ReactNode;
};

const RetryContext = createContext<
  (resetErrorBoundary: () => void) => Promise<void>
>(async resetErrorBoundary => {
  resetErrorBoundary();
});

const AppBoundaryFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const retry = useContext(RetryContext);

  return (
    <ErrorFallback error={error} onRetry={() => retry(resetErrorBoundary)} />
  );
};

export const AppErrorBoundary = ({ children }: Props) => {
  const { reset: resetQueryErrorBoundary } = useQueryErrorResetBoundary();

  const handleError = useCallback((error: unknown, info: ErrorInfo) => {
    const normalizedError =
      error instanceof Error
        ? error
        : new Error(typeof error === 'string' ? error : 'Unknown error');

    reportError(normalizedError, {
      scope: 'global-error-boundary',
      componentStack: info.componentStack ?? undefined,
    }).catch(reportingError => {
      console.error('Failed to report error', reportingError);
    });
  }, []);

  const handleRetry = useCallback(
    async (resetErrorBoundary: () => void) => {
      await resetAppState();
      resetQueryErrorBoundary();
      resetErrorBoundary();
    },
    [resetQueryErrorBoundary],
  );

  return (
    <RetryContext.Provider value={handleRetry}>
      <ErrorBoundary
        onError={handleError}
        FallbackComponent={AppBoundaryFallback}
      >
        {children}
      </ErrorBoundary>
    </RetryContext.Provider>
  );
};
