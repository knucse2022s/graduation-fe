import type { mustBeCourse, normalCourse, Counsel } from '../component/types';

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

export interface LoginPayload {
  studentId: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  [key: string]: unknown;
}

export interface SignupPayload extends LoginPayload {
  name: string;
  major: string;
}

export interface GraduationData {
  student: {
    name: string;
    studentId: string;
    major: string;
  };
  mustBeCourses: mustBeCourse[];
  normalCourses: normalCourse[];
  Counsel: Counsel;
  English?: {
    id: number;
    check: boolean;
  };
  SDGs?: {
    id: number;
    check: boolean;
  };
  GraduationThesisAndCapstone?: {
    id: number;
    check: boolean;
  };
  [key: string]: unknown;
}

function sanitizeToken(rawToken: string | null): string | null {
  if (!rawToken) return null;
  // Remove accidental surrounding quotes or whitespace.
  return rawToken.replace(/^"+|"+$/g, '').trim();
}

export function login(payload: LoginPayload) {
  return request<LoginResponse>(`/auth/login`, {
    method: 'POST',
    body: payload,
  });
}

export function signup(payload: SignupPayload) {
  return request(`/auth/signup`, {
    method: 'POST',
    body: payload,
  });
}

export function fetchMyGraduationData() {
  const storedToken = sanitizeToken(localStorage.getItem('accessToken'));
  if (!storedToken) {
    throw new Error('액세스 토큰이 없습니다. 다시 로그인해주세요.');
  }

  return request<GraduationData>(`/graduation/my`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${storedToken}`,
    },
  });
}
