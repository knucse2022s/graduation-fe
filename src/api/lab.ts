import type { Lab, ExperienceTask } from '../component/types';

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

// 랩실 목록 조회
export function fetchLabs() {
  return request<Lab[]>(`/labs`, {
    method: 'GET',
  });
}

// 랩실 상세 조회
export function fetchLabById(labId: number) {
  return request<Lab>(`/labs/${labId}`, {
    method: 'GET',
  });
}

// 체험 과제 상세 조회
export function fetchExperienceTask(labId: number, taskId: number) {
  return request<ExperienceTask>(`/labs/${labId}/tasks/${taskId}`, {
    method: 'GET',
  });
}

// 체험 후기 작성
export interface ReviewPayload {
  rating: number;
  comment: string;
}

export function createTaskReview(labId: number, taskId: number, payload: ReviewPayload) {
  const storedToken = localStorage.getItem('accessToken');
  if (!storedToken) {
    throw new Error('로그인이 필요합니다.');
  }

  return request(`/labs/${labId}/tasks/${taskId}/reviews`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${storedToken.trim()}`,
    },
    body: payload,
  });
}

