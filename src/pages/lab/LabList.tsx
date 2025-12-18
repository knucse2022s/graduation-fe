import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLabs } from "../../api/lab";
import type { Lab } from "../../component/types";
import "./LabList.css";

function LabList() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    loadLabs();
  }, []);

  const loadLabs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLabs();
      setLabs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "랩실 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 연구 분야 목록 추출
  const researchFields = Array.from(
    new Set(labs.flatMap((lab) => lab.researchField))
  ).sort();

  // 필터링된 랩실 목록
  const filteredLabs = labs.filter((lab) => {
    const matchesSearch =
      lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.professor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.researchField.some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesField = selectedField === "" || lab.researchField.includes(selectedField);

    return matchesSearch && matchesField;
  });

  if (loading) {
    return (
      <div className="lab-list-page">
        <div className="lab-list-loading">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lab-list-page">
        <div className="lab-list-error">
          <p>{error}</p>
          <button onClick={loadLabs}>다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="lab-list-page">
      <div className="lab-list-container">
        <h1 className="lab-list-title">랩실 목록</h1>
        <p className="lab-list-subtitle">
          관심 있는 랩실을 찾아 사전 체험을 시작해보세요
        </p>

        {/* 검색 및 필터 */}
        <div className="lab-list-filters">
          <div className="lab-search-box">
            <input
              type="text"
              placeholder="랩실명, 교수명, 학과, 연구분야로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="lab-search-input"
            />
          </div>
          <div className="lab-filter-box">
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="lab-filter-select"
            >
              <option value="">전체 연구분야</option>
              {researchFields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 랩실 목록 */}
        <div className="lab-list-grid">
          {filteredLabs.length === 0 ? (
            <div className="lab-list-empty">
              검색 결과가 없습니다.
            </div>
          ) : (
            filteredLabs.map((lab) => (
              <div
                key={lab.id}
                className="lab-card"
                onClick={() => navigate(`/labs/${lab.id}`)}
              >
                <div className="lab-card-header">
                  <h2 className="lab-card-name">{lab.name}</h2>
                  <span className="lab-card-department">{lab.department}</span>
                </div>
                <div className="lab-card-professor">
                  <span className="lab-card-label">지도교수:</span> {lab.professor}
                </div>
                <div className="lab-card-field">
                  <span className="lab-card-label">연구분야:</span>
                  <div className="lab-card-tags">
                    {lab.researchField.map((field, index) => (
                      <span key={index} className="lab-card-tag">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="lab-card-description">{lab.description}</div>
                <div className="lab-card-footer">
                  <span className="lab-card-task-count">
                    체험 과제 {lab.experienceTasks.length}개
                  </span>
                  <span className="lab-card-arrow">→</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default LabList;

