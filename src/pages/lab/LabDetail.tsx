import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchLabById } from "../../api/lab";
import type { Lab, DifficultyLevel } from "../../component/types";
import "./LabDetail.css";

function LabDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lab, setLab] = useState<Lab | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | "전체">("전체");

  useEffect(() => {
    if (id) {
      loadLab(parseInt(id));
    }
  }, [id]);

  const loadLab = async (labId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLabById(labId);
      setLab(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "랩실 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case "초급":
        return "#4caf50";
      case "중급":
        return "#ff9800";
      case "고급":
        return "#f44336";
      default:
        return "#666";
    }
  };

  const filteredTasks = lab?.experienceTasks.filter((task) => {
    if (selectedDifficulty === "전체") return true;
    return task.difficulty === selectedDifficulty;
  }) || [];

  if (loading) {
    return (
      <div className="lab-detail-page">
        <div className="lab-detail-loading">로딩 중...</div>
      </div>
    );
  }

  if (error || !lab) {
    return (
      <div className="lab-detail-page">
        <div className="lab-detail-error">
          <p>{error || "랩실 정보를 찾을 수 없습니다."}</p>
          <button onClick={() => navigate("/labs")}>목록으로 돌아가기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="lab-detail-page">
      <div className="lab-detail-container">
        {/* 헤더 */}
        <div className="lab-detail-header">
          <button className="lab-detail-back" onClick={() => navigate("/labs")}>
            ← 목록으로
          </button>
          <div className="lab-detail-title-section">
            <h1 className="lab-detail-name">{lab.name}</h1>
            <div className="lab-detail-meta">
              <span className="lab-detail-department">{lab.department}</span>
              <span className="lab-detail-separator">•</span>
              <span className="lab-detail-professor">지도교수: {lab.professor}</span>
            </div>
          </div>
        </div>

        {/* 랩실 정보 */}
        <div className="lab-detail-info">
          <div className="lab-detail-section">
            <h2 className="lab-detail-section-title">연구 분야</h2>
            <div className="lab-detail-tags">
              {lab.researchField.map((field, index) => (
                <span key={index} className="lab-detail-tag">
                  {field}
                </span>
              ))}
            </div>
          </div>

          <div className="lab-detail-section">
            <h2 className="lab-detail-section-title">랩실 소개</h2>
            <p className="lab-detail-description">{lab.description}</p>
          </div>

          {lab.requirements && (
            <div className="lab-detail-section">
              <h2 className="lab-detail-section-title">요구사항</h2>
              <div className="lab-detail-requirements">
                {lab.requirements.preferredSkills && (
                  <div className="lab-detail-requirement-item">
                    <span className="lab-detail-requirement-label">선호 기술:</span>
                    <div className="lab-detail-requirement-tags">
                      {lab.requirements.preferredSkills.map((skill, index) => (
                        <span key={index} className="lab-detail-requirement-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {lab.requirements.minGpa && (
                  <div className="lab-detail-requirement-item">
                    <span className="lab-detail-requirement-label">최소 학점:</span>
                    <span>{lab.requirements.minGpa} 이상</span>
                  </div>
                )}
                {lab.requirements.other && (
                  <div className="lab-detail-requirement-item">
                    <span className="lab-detail-requirement-label">기타:</span>
                    <span>{lab.requirements.other}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {lab.contact && (
            <div className="lab-detail-section">
              <h2 className="lab-detail-section-title">연락처</h2>
              <div className="lab-detail-contact">
                {lab.contact.email && (
                  <div className="lab-detail-contact-item">
                    <span className="lab-detail-contact-label">이메일:</span>
                    <a href={`mailto:${lab.contact.email}`}>{lab.contact.email}</a>
                  </div>
                )}
                {lab.contact.office && (
                  <div className="lab-detail-contact-item">
                    <span className="lab-detail-contact-label">연구실:</span>
                    <span>{lab.contact.office}</span>
                  </div>
                )}
                {lab.contact.website && (
                  <div className="lab-detail-contact-item">
                    <span className="lab-detail-contact-label">웹사이트:</span>
                    <a href={lab.contact.website} target="_blank" rel="noopener noreferrer">
                      {lab.contact.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 사전 체험 추천 과제 */}
        <div className="lab-detail-tasks">
          <div className="lab-detail-tasks-header">
            <h2 className="lab-detail-section-title">사전 체험 추천 과제</h2>
            <p className="lab-detail-tasks-subtitle">
              랩실에 들어가기 전에 이 과제들을 체험해보세요
            </p>
          </div>

          {/* 난이도 필터 */}
          <div className="lab-detail-difficulty-filter">
            <button
              className={`lab-detail-filter-btn ${selectedDifficulty === "전체" ? "active" : ""}`}
              onClick={() => setSelectedDifficulty("전체")}
            >
              전체
            </button>
            <button
              className={`lab-detail-filter-btn ${selectedDifficulty === "초급" ? "active" : ""}`}
              onClick={() => setSelectedDifficulty("초급")}
            >
              초급
            </button>
            <button
              className={`lab-detail-filter-btn ${selectedDifficulty === "중급" ? "active" : ""}`}
              onClick={() => setSelectedDifficulty("중급")}
            >
              중급
            </button>
            <button
              className={`lab-detail-filter-btn ${selectedDifficulty === "고급" ? "active" : ""}`}
              onClick={() => setSelectedDifficulty("고급")}
            >
              고급
            </button>
          </div>

          {/* 과제 목록 */}
          {filteredTasks.length === 0 ? (
            <div className="lab-detail-tasks-empty">
              선택한 난이도의 과제가 없습니다.
            </div>
          ) : (
            <div className="lab-detail-tasks-grid">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="lab-detail-task-card"
                  onClick={() => navigate(`/labs/${lab.id}/tasks/${task.id}`)}
                >
                  <div className="lab-detail-task-header">
                    <h3 className="lab-detail-task-title">{task.title}</h3>
                    <span
                      className="lab-detail-task-difficulty"
                      style={{ backgroundColor: getDifficultyColor(task.difficulty) }}
                    >
                      {task.difficulty}
                    </span>
                  </div>
                  <p className="lab-detail-task-description">{task.description}</p>
                  <div className="lab-detail-task-info">
                    <div className="lab-detail-task-time">
                      <span className="lab-detail-task-icon">⏱</span>
                      예상 소요 시간: {task.estimatedTime}시간
                    </div>
                    {task.prerequisites && task.prerequisites.length > 0 && (
                      <div className="lab-detail-task-prerequisites">
                        <span className="lab-detail-task-icon">📚</span>
                        선수 지식: {task.prerequisites.join(", ")}
                      </div>
                    )}
                  </div>
                  {task.reviews && task.reviews.length > 0 && (
                    <div className="lab-detail-task-reviews">
                      <span className="lab-detail-task-icon">⭐</span>
                      후기 {task.reviews.length}개
                    </div>
                  )}
                  <div className="lab-detail-task-footer">
                    <span className="lab-detail-task-arrow">자세히 보기 →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LabDetail;

