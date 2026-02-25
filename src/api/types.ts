import { ZodType } from 'zod';
import { ApiError } from './errors';

export type ApiSchema<T> = ZodType<T>;
export type ApiRequestError = ApiError | Error;
