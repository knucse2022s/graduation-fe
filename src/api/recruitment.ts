// Supabase를 이용한 학부연구생 모집 여부 API

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://odorutrrkwrcbbonikig.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kb3J1dHJya3dyY2Jib25pa2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzQ0ODEsImV4cCI6MjA4MTY1MDQ4MX0.fCC5mw3_RCHkrvaXfUAx-Qszq-6K5NuR6vANPYozZK8';

export interface RecruitmentStatus {
  facultyId: number;
  isRecruiting: boolean;
}

// 교수 ID로 모집 여부 조회
export async function getRecruitmentStatus(facultyId: number): Promise<boolean> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/recruitment?faculty_id=eq.${facultyId}&select=is_recruiting`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('모집 여부를 불러오는데 실패했습니다.');
    }

    const data = await response.json();
    if (data && data.length > 0) {
      return data[0].is_recruiting;
    }
    return false; // 기본값: 모집 안함
  } catch (error) {
    console.error('Error fetching recruitment status:', error);
    return false; // 에러 시 기본값: 모집 안함
  }
}

// 여러 교수 ID로 모집 여부 일괄 조회
export async function getRecruitmentStatuses(facultyIds: number[]): Promise<Map<number, boolean>> {
  const statusMap = new Map<number, boolean>();
  
  try {
    const ids = facultyIds.join(',');
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/recruitment?faculty_id=in.(${ids})&select=faculty_id,is_recruiting`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('모집 여부를 불러오는데 실패했습니다.');
    }

    const data = await response.json();
    data.forEach((item: { faculty_id: number; is_recruiting: boolean }) => {
      statusMap.set(item.faculty_id, item.is_recruiting);
    });

    // 없는 교수는 기본값 false로 설정
    facultyIds.forEach((id) => {
      if (!statusMap.has(id)) {
        statusMap.set(id, false);
      }
    });
  } catch (error) {
    console.error('Error fetching recruitment statuses:', error);
    // 에러 시 모든 교수를 false로 설정
    facultyIds.forEach((id) => {
      statusMap.set(id, false);
    });
  }

  return statusMap;
}

// 모집 여부 업데이트 (관리자용)
export async function updateRecruitmentStatus(
  facultyId: number,
  isRecruiting: boolean,
  adminToken?: string
): Promise<void> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/recruitment`,
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
          is_recruiting: isRecruiting,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('모집 여부 업데이트에 실패했습니다.');
    }
  } catch (error) {
    console.error('Error updating recruitment status:', error);
    throw error;
  }
}

// 모든 모집 여부 조회 (관리자용)
export async function getAllRecruitmentStatuses(adminToken?: string): Promise<RecruitmentStatus[]> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/recruitment?select=faculty_id,is_recruiting&order=faculty_id`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${adminToken || SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('모집 여부를 불러오는데 실패했습니다.');
    }

    const data = await response.json();
    return data.map((item: { faculty_id: number; is_recruiting: boolean }) => ({
      facultyId: item.faculty_id,
      isRecruiting: item.is_recruiting,
    }));
  } catch (error) {
    console.error('Error fetching all recruitment statuses:', error);
    throw error;
  }
}

