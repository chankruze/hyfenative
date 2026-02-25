import { z } from 'zod';

export const ApiBaseSchema = z.object({
  success: z.boolean(),
  message: z.string().nullable().optional(),
  notice: z.string().nullable().optional(),
  error: z.string().nullable().optional(),
});

export const PaginationSchema = z.object({
  total: z.number(), // total items
  page: z.number(), // current page
  perPage: z.number(), // items per page
  totalPages: z.number(), // total pages
  prevPage: z.number().nullable(), // previous page number or null
  nextPage: z.number().nullable(), // next page number or null
  from: z.number(), // first item index (1-based) on this page
  to: z.number(), // last item index (1-based) on this page
});

// Generic keyed response with pagination
export const ApiKeyedResponseSchema = <K extends string, T extends z.ZodType>(
  key: K,
  schema: T,
) => {
  return ApiBaseSchema.extend({
    [key]: schema,
    pagination: PaginationSchema.optional(),
  });
};
