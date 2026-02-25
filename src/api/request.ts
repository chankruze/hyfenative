import { api } from './client';
import { z } from 'zod';
import { toApiError } from './errors';

/**
 * Shared executor
 */
async function executeRequest<TSchema extends z.ZodType<unknown>>(
  requestPromise: Promise<unknown>,
  schema: TSchema,
): Promise<z.output<TSchema>> {
  try {
    const json = await requestPromise;
    return schema.parse(json);
  } catch (error) {
    throw await toApiError(error);
  }
}

export async function getWithSchema<TResponseSchema extends z.ZodType<unknown>>(
  url: string,
  responseSchema: TResponseSchema,
): Promise<z.output<TResponseSchema>> {
  return executeRequest(api.get(url).json(), responseSchema);
}

export async function deleteWithSchema<TResponseSchema extends z.ZodType<unknown>>(
  url: string,
  responseSchema: TResponseSchema,
): Promise<z.output<TResponseSchema>> {
  return executeRequest(api.delete(url).json(), responseSchema);
}

export async function postWithSchema<
  TPayload,
  TResponseSchema extends z.ZodType<unknown>,
>(
  url: string,
  payload: TPayload,
  responseSchema: TResponseSchema,
): Promise<z.output<TResponseSchema>> {
  return executeRequest(api.post(url, { json: payload }).json(), responseSchema);
}

export async function putWithSchema<
  TPayload,
  TResponseSchema extends z.ZodType<unknown>,
>(
  url: string,
  payload: TPayload,
  responseSchema: TResponseSchema,
): Promise<z.output<TResponseSchema>> {
  return executeRequest(api.put(url, { json: payload }).json(), responseSchema);
}

export async function patchWithSchema<
  TPayload,
  TResponseSchema extends z.ZodType<unknown>,
>(
  url: string,
  payload: TPayload,
  responseSchema: TResponseSchema,
): Promise<z.output<TResponseSchema>> {
  return executeRequest(api.patch(url, { json: payload }).json(), responseSchema);
}
