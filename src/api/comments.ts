// 교수진 댓글 API (Supabase)

import type { Comment } from '../component/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://odorutrrkwrcbbonikig.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kb3J1dHJya3dyY2Jib25pa2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzQ0ODEsImV4cCI6MjA4MTY1MDQ4MX0.fCC5mw3_RCHkrvaXfUAx-Qszq-6K5NuR6vANPYozZK8';

// 익명 닉네임 생성
function generateAnonymousName(): string {
  const adjectives = ['조용한', '똑똑한', '성실한', '열정적인', '친절한', '창의적인', '꼼꼼한', '활발한'];
  const nouns = ['학생', '연구원', '개발자', '학부생', '대학원생', '프로그래머'];
  const randomNum = Math.floor(Math.random() * 9999) + 1;
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `익명${adjective}${noun}${randomNum}`;
}

// 댓글 목록 조회
export async function getComments(facultyId: number): Promise<Comment[]> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/comments?faculty_id=eq.${facultyId}&select=*&order=created_at.desc`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('댓글을 불러오는데 실패했습니다.');
    }

    const data = await response.json() as Array<{
      id: number;
      faculty_id: number;
      content: string;
      anonymous_name: string;
      created_at: string;
      like_count?: number;
    }>;
    return data.map((item) => ({
      id: item.id,
      facultyId: item.faculty_id,
      content: item.content,
      anonymousName: item.anonymous_name,
      createdAt: item.created_at,
      likeCount: item.like_count || 0,
    }));
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

// 댓글 작성
export interface CreateCommentPayload {
  content: string;
  anonymousName?: string; // 제공하지 않으면 자동 생성
}

export async function createComment(
  facultyId: number,
  payload: CreateCommentPayload
): Promise<Comment> {
  try {
    const anonymousName = payload.anonymousName || generateAnonymousName();
    
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/comments`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          faculty_id: facultyId,
          content: payload.content,
          anonymous_name: anonymousName,
          like_count: 0,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('댓글 작성에 실패했습니다.');
    }

    const data = await response.json();
    return {
      id: data[0].id,
      facultyId: data[0].faculty_id,
      content: data[0].content,
      anonymousName: data[0].anonymous_name,
      createdAt: data[0].created_at,
      likeCount: data[0].like_count || 0,
    };
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

// 댓글 좋아요
export async function toggleCommentLike(commentId: number): Promise<number> {
  try {
    // 먼저 현재 좋아요 수 조회
    const getResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/comments?id=eq.${commentId}&select=like_count`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!getResponse.ok) {
      throw new Error('댓글 정보를 불러오는데 실패했습니다.');
    }

    const data = await getResponse.json();
    const currentLikeCount = data[0]?.like_count || 0;
    const newLikeCount = currentLikeCount + 1;

    // 좋아요 수 업데이트
    const updateResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/comments?id=eq.${commentId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          like_count: newLikeCount,
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error('좋아요 업데이트에 실패했습니다.');
    }

    return newLikeCount;
  } catch (error) {
    console.error('Error toggling comment like:', error);
    throw error;
  }
}

// 댓글 삭제 (관리자용 또는 작성자용)
export async function deleteComment(commentId: number, adminToken?: string): Promise<void> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/comments?id=eq.${commentId}`,
      {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${adminToken || SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('댓글 삭제에 실패했습니다.');
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

