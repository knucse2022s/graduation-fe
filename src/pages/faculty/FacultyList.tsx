import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { facultyData } from "../../data/facultyData";
import { getRecruitmentStatuses } from "../../api/recruitment";
import "./FacultyList.css";

function FacultyList() {
  const navigate = useNavigate();
  const [recruitmentStatuses, setRecruitmentStatuses] = useState<Map<number, boolean>>(new Map());

  useEffect(() => {
    loadRecruitmentStatuses();
  }, []);

  const loadRecruitmentStatuses = async () => {
    const facultyIds = facultyData.map((professor) => professor.id);
    const statuses = await getRecruitmentStatuses(facultyIds);
    setRecruitmentStatuses(statuses);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCardClick = (professorId: number) => {
    navigate(`/faculty/${professorId}`);
  };

  return (
    <div className="faculty-list-page">
      <div className="faculty-list-container">
        <h1 className="faculty-list-title">컴퓨터학부 교수진</h1>
        <p className="faculty-list-subtitle">
          컴퓨터학부의 교수진을 소개합니다
        </p>

        <div className="faculty-list-grid">
          {facultyData.map((professor) => {
            const isRecruiting = recruitmentStatuses.get(professor.id) || false;
            return (
              <div
                key={professor.id}
                className="faculty-card"
                onClick={() => handleCardClick(professor.id)}
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
          })}
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

export default FacultyList;

