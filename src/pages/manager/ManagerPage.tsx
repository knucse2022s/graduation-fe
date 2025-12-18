import { useState, useEffect } from "react";
import { facultyData } from "../../data/facultyData";
import {
  getAllRecruitmentStatuses,
  updateRecruitmentStatus,
} from "../../api/recruitment";
import { getFacultyDetail, updateFacultyDetail } from "../../api/facultyDetail";
import type { FacultyDetail, Course, Paper } from "../../component/types";
import "./ManagerPage.css";

function ManagerPage() {
  const [recruitmentStatuses, setRecruitmentStatuses] = useState<
    Map<number, boolean>
  >(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 상세 정보 편집 관련 상태
  const [editingFacultyId, setEditingFacultyId] = useState<number | null>(null);
  const [facultyDetail, setFacultyDetail] = useState<FacultyDetail | null>(null);
  const [savingDetail, setSavingDetail] = useState(false);

  useEffect(() => {
    loadRecruitmentStatuses();
  }, []);

  const loadRecruitmentStatuses = async () => {
    try {
      setLoading(true);
      setError(null);
      const statuses = await getAllRecruitmentStatuses();
      const statusMap = new Map<number, boolean>();
      statuses.forEach((status) => {
        statusMap.set(status.facultyId, status.isRecruiting);
      });

      // 모든 교수진에 대해 기본값 설정 (없는 경우 false)
      facultyData.forEach((professor) => {
        if (!statusMap.has(professor.id)) {
          statusMap.set(professor.id, false);
        }
      });

      setRecruitmentStatuses(statusMap);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "모집 여부를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRecruitment = async (facultyId: number) => {
    const currentStatus = recruitmentStatuses.get(facultyId) || false;
    const newStatus = !currentStatus;

    try {
      setSaving(facultyId);
      setError(null);
      await updateRecruitmentStatus(facultyId, newStatus);
      setRecruitmentStatuses((prev) => {
        const newMap = new Map(prev);
        newMap.set(facultyId, newStatus);
        return newMap;
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "모집 여부 업데이트에 실패했습니다."
      );
    } finally {
      setSaving(null);
    }
  };

  const handleEditDetail = async (facultyId: number) => {
    try {
      setEditingFacultyId(facultyId);
      const detail = await getFacultyDetail(facultyId);
      if (detail) {
        setFacultyDetail(detail);
      } else {
        // 정보가 없으면 새로 생성
        setFacultyDetail({
          facultyId,
          courses: [],
          papers: [],
          advice: "",
          researchField: "",
          labIntroduction: "",
        });
      }
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "상세 정보를 불러오는데 실패했습니다."
      );
    }
  };

  const handleSaveDetail = async () => {
    if (!editingFacultyId || !facultyDetail) return;

    try {
      setSavingDetail(true);
      setError(null);
      await updateFacultyDetail(editingFacultyId, facultyDetail);
      alert("상세 정보가 저장되었습니다.");
      setEditingFacultyId(null);
      setFacultyDetail(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "상세 정보 저장에 실패했습니다."
      );
    } finally {
      setSavingDetail(false);
    }
  };

  const handleAddCourse = () => {
    if (!facultyDetail) return;
    const newCourse: Course = {
      id: Date.now(),
      name: "",
      code: "",
      description: "",
      semester: "",
    };
    setFacultyDetail({
      ...facultyDetail,
      courses: [...(facultyDetail.courses || []), newCourse],
    });
  };

  const handleUpdateCourse = (index: number, field: keyof Course, value: string) => {
    if (!facultyDetail || !facultyDetail.courses) return;
    const updatedCourses = [...facultyDetail.courses];
    updatedCourses[index] = { ...updatedCourses[index], [field]: value };
    setFacultyDetail({ ...facultyDetail, courses: updatedCourses });
  };

  const handleRemoveCourse = (index: number) => {
    if (!facultyDetail || !facultyDetail.courses) return;
    const updatedCourses = facultyDetail.courses.filter((_, i) => i !== index);
    setFacultyDetail({ ...facultyDetail, courses: updatedCourses });
  };

  const handleAddPaper = () => {
    if (!facultyDetail) return;
    const newPaper: Paper = {
      id: Date.now(),
      title: "",
      authors: [],
      journal: "",
      year: undefined,
      url: "",
      doi: "",
    };
    setFacultyDetail({
      ...facultyDetail,
      papers: [...(facultyDetail.papers || []), newPaper],
    });
  };

  const handleUpdatePaper = (index: number, field: keyof Paper, value: string | number | string[] | undefined) => {
    if (!facultyDetail || !facultyDetail.papers) return;
    const updatedPapers = [...facultyDetail.papers];
    updatedPapers[index] = { ...updatedPapers[index], [field]: value };
    setFacultyDetail({ ...facultyDetail, papers: updatedPapers });
  };

  const handleRemovePaper = (index: number) => {
    if (!facultyDetail || !facultyDetail.papers) return;
    const updatedPapers = facultyDetail.papers.filter((_, i) => i !== index);
    setFacultyDetail({ ...facultyDetail, papers: updatedPapers });
  };

  if (loading) {
    return (
      <div className="manager-page">
        <div className="manager-loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="manager-page">
      <div className="manager-container">
        <div className="manager-header">
          <h1 className="manager-title">학부연구생 모집 관리</h1>
          <p className="manager-subtitle">
            교수진별 학부연구생 모집 여부를 관리할 수 있습니다
          </p>
        </div>

        {error && (
          <div className="manager-error">
            <p>{error}</p>
            <button onClick={loadRecruitmentStatuses}>다시 시도</button>
          </div>
        )}

        <div className="manager-stats">
          <div className="manager-stat-card">
            <span className="manager-stat-label">모집 중</span>
            <span className="manager-stat-value recruiting">
              {Array.from(recruitmentStatuses.values()).filter(Boolean).length}
            </span>
          </div>
          <div className="manager-stat-card">
            <span className="manager-stat-label">모집 안함</span>
            <span className="manager-stat-value not-recruiting">
              {Array.from(recruitmentStatuses.values()).filter((v) => !v).length}
            </span>
          </div>
        </div>

        <div className="manager-table-container">
          <table className="manager-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>이름</th>
                <th>직책</th>
                <th>모집 여부</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {facultyData.map((professor) => {
                const isRecruiting =
                  recruitmentStatuses.get(professor.id) || false;
                const isSaving = saving === professor.id;

                return (
                  <tr key={professor.id}>
                    <td>{professor.id}</td>
                    <td className="manager-name">{professor.name}</td>
                    <td className="manager-title-cell">
                      {professor.title || "-"}
                    </td>
                    <td>
                      <span
                        className={`manager-status ${
                          isRecruiting ? "recruiting" : "not-recruiting"
                        }`}
                      >
                        {isRecruiting ? "모집 중" : "모집 안함"}
                      </span>
                    </td>
                    <td>
                      <div className="manager-actions">
                        <button
                          className={`manager-toggle-btn ${
                            isRecruiting ? "recruiting" : "not-recruiting"
                          }`}
                          onClick={() => handleToggleRecruitment(professor.id)}
                          disabled={isSaving}
                        >
                          {isSaving
                            ? "저장 중..."
                            : isRecruiting
                            ? "모집 중지"
                            : "모집 시작"}
                        </button>
                        <button
                          className="manager-edit-detail-btn"
                          onClick={() => handleEditDetail(professor.id)}
                        >
                          상세 정보 편집
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 상세 정보 편집 모달 */}
        {editingFacultyId && facultyDetail && (
          <div className="manager-modal-overlay" onClick={() => setEditingFacultyId(null)}>
            <div className="manager-modal" onClick={(e) => e.stopPropagation()}>
              <div className="manager-modal-header">
                <h2 className="manager-modal-title">
                  {facultyData.find((p) => p.id === editingFacultyId)?.name} 교수님 상세 정보
                </h2>
                <button
                  className="manager-modal-close"
                  onClick={() => setEditingFacultyId(null)}
                >
                  ×
                </button>
              </div>

              <div className="manager-modal-content">
                {/* 연구 분야 */}
                <div className="manager-form-group">
                  <label className="manager-form-label">연구 분야</label>
                  <textarea
                    className="manager-form-textarea"
                    value={facultyDetail.researchField || ""}
                    onChange={(e) =>
                      setFacultyDetail({
                        ...facultyDetail,
                        researchField: e.target.value,
                      })
                    }
                    rows={3}
                    placeholder="연구 분야를 입력하세요"
                  />
                </div>

                {/* 교과목 */}
                <div className="manager-form-group">
                  <div className="manager-form-group-header">
                    <label className="manager-form-label">개설 교과목</label>
                    <button
                      className="manager-add-btn"
                      onClick={handleAddCourse}
                    >
                      + 추가
                    </button>
                  </div>
                  {facultyDetail.courses?.map((course, index) => (
                    <div key={course.id} className="manager-form-item">
                      <input
                        className="manager-form-input"
                        placeholder="과목명"
                        value={course.name}
                        onChange={(e) =>
                          handleUpdateCourse(index, "name", e.target.value)
                        }
                      />
                      <input
                        className="manager-form-input"
                        placeholder="과목 코드"
                        value={course.code || ""}
                        onChange={(e) =>
                          handleUpdateCourse(index, "code", e.target.value)
                        }
                      />
                      <textarea
                        className="manager-form-textarea"
                        placeholder="설명"
                        value={course.description || ""}
                        onChange={(e) =>
                          handleUpdateCourse(index, "description", e.target.value)
                        }
                        rows={2}
                      />
                      <input
                        className="manager-form-input"
                        placeholder="학기 (예: 2024-1)"
                        value={course.semester || ""}
                        onChange={(e) =>
                          handleUpdateCourse(index, "semester", e.target.value)
                        }
                      />
                      <button
                        className="manager-remove-btn"
                        onClick={() => handleRemoveCourse(index)}
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>

                {/* 논문 */}
                <div className="manager-form-group">
                  <div className="manager-form-group-header">
                    <label className="manager-form-label">주요 논문</label>
                    <button
                      className="manager-add-btn"
                      onClick={handleAddPaper}
                    >
                      + 추가
                    </button>
                  </div>
                  {facultyDetail.papers?.map((paper, index) => (
                    <div key={paper.id} className="manager-form-item">
                      <input
                        className="manager-form-input"
                        placeholder="논문 제목"
                        value={paper.title}
                        onChange={(e) =>
                          handleUpdatePaper(index, "title", e.target.value)
                        }
                      />
                      <input
                        className="manager-form-input"
                        placeholder="저자 (쉼표로 구분)"
                        value={paper.authors?.join(", ") || ""}
                        onChange={(e) =>
                          handleUpdatePaper(
                            index,
                            "authors",
                            e.target.value.split(",").map((a) => a.trim())
                          )
                        }
                      />
                      <input
                        className="manager-form-input"
                        placeholder="학술지"
                        value={paper.journal || ""}
                        onChange={(e) =>
                          handleUpdatePaper(index, "journal", e.target.value)
                        }
                      />
                      <input
                        className="manager-form-input"
                        placeholder="연도"
                        type="number"
                        value={paper.year || ""}
                        onChange={(e) =>
                          handleUpdatePaper(
                            index,
                            "year",
                            e.target.value ? parseInt(e.target.value) : undefined
                          )
                        }
                      />
                      <input
                        className="manager-form-input"
                        placeholder="URL"
                        value={paper.url || ""}
                        onChange={(e) =>
                          handleUpdatePaper(index, "url", e.target.value)
                        }
                      />
                      <input
                        className="manager-form-input"
                        placeholder="DOI"
                        value={paper.doi || ""}
                        onChange={(e) =>
                          handleUpdatePaper(index, "doi", e.target.value)
                        }
                      />
                      <button
                        className="manager-remove-btn"
                        onClick={() => handleRemovePaper(index)}
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>

                {/* 조언 */}
                <div className="manager-form-group">
                  <label className="manager-form-label">
                    이 분야를 오기 위해서는?
                  </label>
                  <textarea
                    className="manager-form-textarea"
                    value={facultyDetail.advice || ""}
                    onChange={(e) =>
                      setFacultyDetail({
                        ...facultyDetail,
                        advice: e.target.value,
                      })
                    }
                    rows={5}
                    placeholder="이 분야를 오기 위한 조언을 입력하세요"
                  />
                </div>

                {/* 연구실 소개 */}
                <div className="manager-form-group">
                  <label className="manager-form-label">연구실 소개</label>
                  <textarea
                    className="manager-form-textarea"
                    value={facultyDetail.labIntroduction || ""}
                    onChange={(e) =>
                      setFacultyDetail({
                        ...facultyDetail,
                        labIntroduction: e.target.value,
                      })
                    }
                    rows={5}
                    placeholder="연구실 소개를 입력하세요"
                  />
                </div>
              </div>

              <div className="manager-modal-footer">
                <button
                  className="manager-cancel-btn"
                  onClick={() => setEditingFacultyId(null)}
                >
                  취소
                </button>
                <button
                  className="manager-save-btn"
                  onClick={handleSaveDetail}
                  disabled={savingDetail}
                >
                  {savingDetail ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerPage;

