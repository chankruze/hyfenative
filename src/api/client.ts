import ky from 'ky';
import { queryClient } from '@/lib/query-client';
import { clearAuthStore, getAccessTokenFromStore } from '@/stores/use-auth-store';
import { API_BASE_URL, API_PREFIX } from './config';
import {
  convertKeysToCamelCase,
  convertKeysToSnakeCase,
} from '@/utils/convert-case';

export const api = ky.create({
  prefixUrl: `${API_BASE_URL}/${API_PREFIX}`,
  headers: {
    Accept: 'application/json',
  },

  hooks: {
    /**
     * BEFORE REQUEST
     * - Attach token
     * - Convert body to snake_case
     */
    beforeRequest: [
      async request => {
        const token = getAccessTokenFromStore();

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }

        const contentType = request.headers.get('content-type');

        if (!contentType?.includes('application/json')) {
          return;
        }

        const rawBody = await request.clone().text();

        if (!rawBody) {
          return;
        }

        try {
          const parsed = JSON.parse(rawBody);
          const transformedBody = JSON.stringify(convertKeysToSnakeCase(parsed));
          return new Request(request, { body: transformedBody });
        } catch {
          // Keep original body if it cannot be parsed.
        }
      },
    ],

    /**
     * RETRY LOGGING
     */
    beforeRetry: [
      ({ error }) => {
        console.log('Retrying request:', error);
      },
    ],

    /**
     * AFTER RESPONSE
     * - Auto camelCase transform
     * - Handle 401
     */
    afterResponse: [
      async (_, __, response) => {
        if (response.status === 401) {
          clearAuthStore();
          queryClient.clear();
        }

        // If JSON response → transform to camelCase
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
          const data = await response.clone().json();
          const transformed = convertKeysToCamelCase(data);

          return new Response(JSON.stringify(transformed), {
            status: response.status,
            statusText: response.statusText,
            headers: new Headers(response.headers),
          });
        }

        return response;
      },
    ],
  },
});
