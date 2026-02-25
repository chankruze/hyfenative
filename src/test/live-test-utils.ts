type NodeEnvMap = Record<string, string | undefined>;

const getNodeEnv = (): NodeEnvMap =>
  (
    globalThis as unknown as {
      process?: { env?: NodeEnvMap };
    }
  ).process?.env ?? {};

const nodeEnv = getNodeEnv();

export const LIVE_API_ENABLED = nodeEnv.RUN_LIVE_API_TESTS === 'true';

export const describeLive = LIVE_API_ENABLED ? describe : describe.skip;

export const requiredEnv = (name: string): string => {
  const value = nodeEnv[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

export const optionalEnv = (name: string): string | undefined => nodeEnv[name];
