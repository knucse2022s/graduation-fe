import type { Faculty } from '../component/types';

const API_BASE_URL = 'http://192.168.0.99:8080';

interface JsonRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

async function request<T>(path: string, options: JsonRequestOptions): Promise<T> {
  const { body, headers, ...rest } = options;
  const formattedBody =
    body !== undefined && body !== null && typeof body === 'object' && !(body instanceof FormData)
      ? JSON.stringify(body)
      : (body as BodyInit | null | undefined);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
    ...rest,
    body: formattedBody ?? null,
  });

  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    const message =
      (typeof payload === 'string' && payload) ||
      (typeof payload === 'object' &&
        payload !== null &&
        'message' in payload &&
        typeof (payload as { message?: string }).message === 'string' &&
        (payload as { message?: string }).message) ||
      '요청에 실패했습니다.';
    throw new Error(message as string);
  }

  return payload as T;
}

// 교수진 목록 조회
export function fetchFaculty() {
  return request<Faculty[]>(`/faculty`, {
    method: 'GET',
  });
}

