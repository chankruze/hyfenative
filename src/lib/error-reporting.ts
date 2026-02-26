export type ErrorContext = {
  componentStack?: string;
  scope?: string;
  metadata?: Record<string, unknown>;
};

export type ErrorReporter = (
  error: Error,
  context?: ErrorContext,
) => void | Promise<void>;

const defaultReporter: ErrorReporter = (error, context) => {
  console.error('Unhandled application error', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    context,
  });
};

let activeReporter: ErrorReporter = defaultReporter;

export const setErrorReporter = (reporter: ErrorReporter) => {
  activeReporter = reporter;
};

export const reportError = async (error: Error, context?: ErrorContext) => {
  try {
    await activeReporter(error, context);
  } catch (reportingError) {
    console.error('Error reporter failed', reportingError);
    defaultReporter(error, context);
  }
};
