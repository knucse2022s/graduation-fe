import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { facultyData } from "../../data/facultyData";
import { getRecruitmentStatuses } from "../../api/recruitment";
import type { Faculty } from "../../component/types";
import "./FacultyList.css";

// 한글 초성 추출 함수 (컴포넌트 외부로 이동하여 재생성 방지)
const getInitialConsonant = (char: string): string => {
  const code = char.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) {
    // 한글 유니코드 범위
    const initialConsonants = [
      "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
      "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"
    ];
    const initialIndex = Math.floor((code - 0xac00) / 588);
    return initialConsonants[initialIndex] || "";
  }
  return "";
};

// 검색어와 교수 이름 매칭 함수 (컴포넌트 외부로 이동하여 재생성 방지)
const matchesSearch = (professorName: string, query: string): boolean => {
  if (!query.trim()) return true;
  
  const normalizedQuery = query.toLowerCase().trim();
  const normalizedName = professorName.toLowerCase();
  
  // 일반 문자열 포함 검색
  if (normalizedName.includes(normalizedQuery)) {
    return true;
  }
  
  // 한글 초성 검색
  if (/^[ㄱ-ㅎ]+$/.test(query)) {
    // 검색어가 초성만 있는 경우
    const nameInitials = professorName
      .split("")
      .map((char) => getInitialConsonant(char))
      .join("");
    return nameInitials.includes(query);
  }
  
  return false;
};

function FacultyList() {
  const navigate = useNavigate();
  const [recruitmentStatuses, setRecruitmentStatuses] = useState<Map<number, boolean>>(new Map());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadRecruitmentStatuses = async () => {
      const facultyIds = facultyData.map((professor) => professor.id);
      const statuses = await getRecruitmentStatuses(facultyIds);
      setRecruitmentStatuses(statuses);
    };
    void loadRecruitmentStatuses();
  }, []);

  // 검색어에 따라 필터링된 교수진 목록 (메모이제이션)
  const filteredFaculty = useMemo(() => {
    return facultyData.filter((professor) =>
      matchesSearch(professor.name, searchQuery)
    );
  }, [searchQuery]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCardClick = useCallback((professorId: number) => {
    navigate(`/faculty/${professorId}`);
  }, [navigate]);

  return (
    <div className="faculty-list-page">
      <div className="faculty-list-container">
        <h1 className="faculty-list-title">컴퓨터학부 교수진</h1>
        <p className="faculty-list-subtitle">
          컴퓨터학부의 교수진을 소개합니다
        </p>

        {/* 검색 입력 필드 */}
        <div className="faculty-search-container">
          <input
            type="text"
            className="faculty-search-input"
            placeholder="교수님 이름을 검색하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="faculty-search-clear"
              onClick={() => setSearchQuery("")}
              aria-label="검색어 지우기"
            >
              ×
            </button>
          )}
        </div>

        {/* 검색 결과 개수 */}
        {searchQuery && (
          <p className="faculty-search-result">
            검색 결과: {filteredFaculty.length}명
          </p>
        )}

        {/* 검색 결과가 없을 때 */}
        {searchQuery && filteredFaculty.length === 0 && (
          <div className="faculty-search-empty">
            <p>검색 결과가 없습니다.</p>
            <button
              className="faculty-search-empty-button"
              onClick={() => setSearchQuery("")}
            >
              검색어 지우기
            </button>
          </div>
        )}

        <div className="faculty-list-grid">
          {filteredFaculty.map((professor) => (
            <FacultyCard
              key={professor.id}
              professor={professor}
              isRecruiting={recruitmentStatuses.get(professor.id) || false}
              onClick={handleCardClick}
            />
          ))}
        </div>
      </div>

      {/* 스크롤 to top 버튼 */}
      <button className="faculty-scroll-top" onClick={scrollToTop}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4L4 12H8V20H16V12H20L12 4Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  );
}

// 교수 카드 컴포넌트 (메모이제이션으로 불필요한 리렌더링 방지)
interface FacultyCardProps {
  professor: Faculty;
  isRecruiting: boolean;
  onClick: (professorId: number) => void;
}

const FacultyCard = memo(({ professor, isRecruiting, onClick }: FacultyCardProps) => {
  return (
    <div
      className="faculty-card"
      onClick={() => onClick(professor.id)}
    >
      <div className="faculty-card-image-container">
        {professor.imageUrl ? (
          <img
            src={professor.imageUrl}
            alt={professor.name}
            className="faculty-card-image"
          />
        ) : (
          <div className="faculty-card-image-placeholder">
            {professor.name.charAt(0)}
          </div>
        )}
        {/* 학부연구생 모집 여부 심볼 */}
        <div
          className={`faculty-recruitment-badge ${
            isRecruiting ? "recruiting" : "not-recruiting"
          }`}
          title={isRecruiting ? "학부연구생 모집 중" : "학부연구생 모집 안함"}
        >
          <span className="faculty-recruitment-dot"></span>
        </div>
      </div>
      <div className="faculty-card-content">
        <h2 className="faculty-card-name">{professor.name}</h2>
        {professor.title && (
          <p className="faculty-card-title">{professor.title}</p>
        )}
        {professor.phone && (
          <p className="faculty-card-phone">
            <span className="faculty-card-label">전화:</span> {professor.phone}
          </p>
        )}
        {professor.email && (
          <p className="faculty-card-email">
            <span className="faculty-card-label">이메일:</span>{" "}
            <a href={`mailto:${professor.email}`}>{professor.email}</a>
          </p>
        )}
      </div>
    </div>
  );
});

FacultyCard.displayName = "FacultyCard";

export default FacultyList;

