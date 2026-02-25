import { env } from '@/config/env';

const protocol = env.apiProtocol ?? 'http';
const host = env.apiHost ?? 'localhost:3000';
const version = env.apiVersion ?? 'v1';

export const API_BASE_URL = `${protocol}://${host}`;
export const API_PREFIX = `api/${version}`;
