import type { ApiError } from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';
const DEFAULT_TIMEOUT = 30_000;

class ApiClientError extends Error {
  status: number;
  code: string;
  details?: Record<string, string[]>;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function createTimeoutSignal(timeoutMs: number, externalSignal?: AbortSignal): { signal: AbortSignal; clear: () => void } {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(new DOMException('Request timed out', 'TimeoutError')), timeoutMs);
  if (externalSignal) {
    externalSignal.addEventListener('abort', () => controller.abort());
  }
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let error: ApiError;
    try {
      error = (await response.json()) as ApiError;
    } catch {
      error = {
        code: 'UNKNOWN_ERROR',
        message: `Request failed with status ${response.status}`,
      };
    }
    throw new ApiClientError(
      response.status,
      error.code,
      error.message,
      error.details,
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function buildUrl(path: string, params?: Record<string, string>) {
  const url = new URL(path, BASE_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value);
      }
    }
  }
  return url.toString();
}

interface RequestOptions {
  params?: Record<string, string>;
  signal?: AbortSignal;
  timeout?: number;
}

export const apiClient = {
  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    const timeout = options?.timeout ?? DEFAULT_TIMEOUT;
    const { signal, clear } = createTimeoutSignal(timeout, options?.signal);
    try {
      const response = await fetch(buildUrl(path, options?.params), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        signal,
      });
      return handleResponse<T>(response);
    } finally {
      clear();
    }
  },

  async post<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
    const timeout = options?.timeout ?? DEFAULT_TIMEOUT;
    const { signal, clear } = createTimeoutSignal(timeout, options?.signal);
    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
        signal,
      });
      return handleResponse<T>(response);
    } finally {
      clear();
    }
  },

  async put<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
    const timeout = options?.timeout ?? DEFAULT_TIMEOUT;
    const { signal, clear } = createTimeoutSignal(timeout, options?.signal);
    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
        signal,
      });
      return handleResponse<T>(response);
    } finally {
      clear();
    }
  },

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    const timeout = options?.timeout ?? DEFAULT_TIMEOUT;
    const { signal, clear } = createTimeoutSignal(timeout, options?.signal);
    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        signal,
      });
      return handleResponse<T>(response);
    } finally {
      clear();
    }
  },
};

export { ApiClientError };
