import { HTTPError } from 'ky';

export type ApiErrorPayload = {
  message: string;
  code?: string;
  details?: unknown;
};

export class ApiError extends Error {
  status?: number;
  code?: string;
  details?: unknown;

  constructor(payload: ApiErrorPayload & { status?: number }) {
    super(payload.message);
    this.name = 'ApiError';
    this.status = payload.status;
    this.code = payload.code;
    this.details = payload.details;
  }
}

const extractMessage = (data: unknown): string | undefined => {
  if (!data || typeof data !== 'object') {
    return undefined;
  }

  const record = data as Record<string, unknown>;
  const candidate = record.message ?? record.error ?? record.title;
  return typeof candidate === 'string' ? candidate : undefined;
};

const extractCode = (data: unknown): string | undefined => {
  if (!data || typeof data !== 'object') {
    return undefined;
  }

  const record = data as Record<string, unknown>;
  const candidate = record.code ?? record.error_code;
  return typeof candidate === 'string' ? candidate : undefined;
};

export const normalizeApiErrorPayload = (
  data: unknown,
  fallbackMessage = 'Something went wrong',
): ApiErrorPayload => ({
  message: extractMessage(data) ?? fallbackMessage,
  code: extractCode(data),
  details: data,
});

export const toApiError = async (error: unknown): Promise<ApiError> => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof HTTPError) {
    const fallbackMessage = error.response.statusText || 'Something went wrong';

    try {
      const data = await error.response.clone().json();
      const normalized = normalizeApiErrorPayload(data, fallbackMessage);
      return new ApiError({
        ...normalized,
        status: error.response.status,
      });
    } catch {
      return new ApiError({
        message: fallbackMessage,
        status: error.response.status,
      });
    }
  }

  if (error instanceof Error) {
    return new ApiError({ message: error.message });
  }

  return new ApiError({ message: 'Network request failed' });
};
