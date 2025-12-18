// 교수 상세 정보 API (Supabase)

import type { FacultyDetail, Course, Paper } from '../component/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://odorutrrkwrcbbonikig.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kb3J1dHJya3dyY2Jib25pa2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzQ0ODEsImV4cCI6MjA4MTY1MDQ4MX0.fCC5mw3_RCHkrvaXfUAx-Qszq-6K5NuR6vANPYozZK8';

// 교수 상세 정보 조회
export async function getFacultyDetail(facultyId: number): Promise<FacultyDetail | null> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/faculty_detail?faculty_id=eq.${facultyId}`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('교수 상세 정보를 불러오는데 실패했습니다.');
    }

    const data = await response.json();
    if (data && data.length > 0) {
      const detail = data[0];
      return {
        facultyId: detail.faculty_id,
        courses: detail.courses || [],
        papers: detail.papers || [],
        advice: detail.advice || '',
        researchField: detail.research_field || '',
        labIntroduction: detail.lab_introduction || '',
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching faculty detail:', error);
    return null;
  }
}

// 교수 상세 정보 업데이트 (관리자용)
export async function updateFacultyDetail(
  facultyId: number,
  detail: Partial<FacultyDetail>,
  adminToken?: string
): Promise<void> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/faculty_detail`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${adminToken || SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          faculty_id: facultyId,
          courses: detail.courses || [],
          papers: detail.papers || [],
          advice: detail.advice || '',
          research_field: detail.researchField || '',
          lab_introduction: detail.labIntroduction || '',
        }),
      }
    );

    if (!response.ok) {
      throw new Error('교수 상세 정보 업데이트에 실패했습니다.');
    }
  } catch (error) {
    console.error('Error updating faculty detail:', error);
    throw error;
  }
}

