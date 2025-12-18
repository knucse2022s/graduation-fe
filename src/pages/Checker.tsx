import { useLocation } from "react-router-dom";
import {
  type mustBeCourse,
  type normalCourse,
  type Counsel,
  type AttendSummary,
  type AdditionalRequirements,
  type AdditionalRequirement,
  type AdditionalRequirementKey,
} from "../component/types";
import { useState } from "react";
import "./design/Checker.css";
import { calcCredits } from "../component/calcCredit";
import Modal from "./design/Modal";
import Show from "./Show";
import AdditionalRequirementsSection from "../component/AdditionalRequirements";

function Checker() {
  const location = useLocation();
  const state = location.state as typeof location.state & Record<string, unknown>;

  const student = state?.student;
  const mustBe = state?.mustBeCourses as mustBeCourse[] | undefined;
  const normal = state?.normalCourses as normalCourse[] | undefined;
  const beforeCounsel: Counsel = (state?.Counsel as Counsel | undefined) ?? { id: -1, times: 0 };
  const additionalRequirementsSource:
    | Partial<AdditionalRequirements>
    | undefined =
    (state?.additionalRequirements as Partial<AdditionalRequirements> | undefined) ?? {
      English: state?.English as AdditionalRequirement | undefined,
      SDGs: state?.SDGs as AdditionalRequirement | undefined,
      GraduationThesisAndCapstone: state?.GraduationThesisAndCapstone as AdditionalRequirement | undefined,
    };

  const [mustBeState, setMustBeState] = useState<mustBeCourse[]>(mustBe ?? []);
  const [normalState, setNormalState] = useState<normalCourse[]>(normal ?? []);
  const [counsel, setCounsel] = useState<Counsel>(beforeCounsel);
  const buildAdditionalRequirements = (): AdditionalRequirements => {
    const normalized = {} as AdditionalRequirements;
    if (!additionalRequirementsSource) {
      return normalized;
    }
    Object.entries(additionalRequirementsSource).forEach(([key, value]) => {
      if (value) {
        normalized[key as AdditionalRequirementKey] = value;
      }
    });
    return normalized;
  };

  const [additionalRequirements, setAdditionalRequirements] =
    useState<AdditionalRequirements>(buildAdditionalRequirements);

  const [summary, setSummary] = useState<AttendSummary | undefined>(undefined);
  const [openModal, setOpenModal] = useState<boolean>(false);

  if (!state || !student) {
    return (
      <div className="checker-page">
        <div className="checker-container">
          <p style={{ textAlign: "center", margin: "40px 0" }}>
            졸업 데이터를 찾을 수 없습니다. 로그인 후 다시 시도해주세요.
          </p>
        </div>
      </div>
    );
  }

  const mustbeToggleCheck = (id: number) => {
    setMustBeState(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, status: c.status === "기이수" ? "이수예정" : "기이수" }
          : c
      )
    );
  };

  const normalToggleCheck = (id: number, newCredit: number) => {
    setNormalState(prev =>
      prev.map(c => (c.id === id ? { ...c, credit: newCredit } : c))
    );
  };

  const updateToggle = (id: number, newTimes: number) => {
    setCounsel(prev => (prev.id === id ? { ...prev, times: newTimes } : prev));
  };

  const toggleAdditionalRequirement = (key: AdditionalRequirementKey) => {
    setAdditionalRequirements(prev => {
      const target = prev[key];
      if (!target) return prev;
      return {
        ...prev,
        [key]: { ...target, check: !target.check },
      };
    });
  };

  const handleConfirm = () => {
    const payload = calcCredits(mustBeState, normalState, counsel, student.studentId, student.major);
    setSummary(payload);
    setOpenModal(true);
  };


  const terms = [
    "1-1",
    "1-2",
    "2-1",
    "2-2",
    "3-1",
    "3-2",
    "4-1",
    "4-2",
    "이수 계절",
    "이수예정 계절"
  ];

  return (
    <div className="checker-page" >
      <div className="checker-container">
        <div className="save-btn-wrapper">
          <button className="save-btn">저장</button>
        </div>
        <h2 className="main-title">{student.name} / {student.studentId}</h2>
        <h3 className="sub-title">전공: {student.major}</h3>

        {/* 필수과목 */}
        <h2 className="section-title">필수 과목</h2>
        <table>
          <thead>
            <tr>
              <th>체크</th>
              <th>과목명</th>
              <th>이수학점</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {mustBeState.map(c => (
              <tr key={c.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={c.status === "기이수"}
                    onChange={() => mustbeToggleCheck(c.id)}
                  />
                </td>
                <td>{c.majorName}</td>
                <td>{c.credit}</td>
                <td>{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* 일반과목 */}
        
        <h2 className="section-title" style={{ marginTop: "40px" }}>
          일반 과목
        </h2>
        <p>※필수과목을 포함해 학점 기입 바람</p>

        <div className="normal-grid" >
          {terms.map((term, idx) => (
            <div
              key={`term-${idx}`}
              className={`term-box ${idx === terms.length - 1 ? "last-term" : ""}`}
            >
              <h3 >{term} 학기</h3>

              <table>
                <thead>
                  <tr>
                    <th>구분</th>
                    <th>학점</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {normalState
                    .filter(c => c.term === term)
                    .map(c => (
                      <tr key={c.id}>
                        <td>{c.major}</td>
                        <td>
                          <select
                            value={c.credit}
                            onChange={e =>
                              normalToggleCheck(c.id, Number(e.target.value))
                            }
                          >
                            {Array.from({ length: 50 }, (_, i) => i).map(num => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>{c.status}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* 상담 */}
        <h2 className="section-title">교수 상담 횟수</h2>

        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <select
            value={counsel.times}
            onChange={e =>
              updateToggle(counsel.id, Number(e.target.value))
            }
          >
            {Array.from({ length: 9 }, (_, i) => i).map(num => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <AdditionalRequirementsSection
          requirements={additionalRequirements}
          onToggle={toggleAdditionalRequirement}
        />
        
        <button className="checker-confirm-btn" onClick={handleConfirm}>
          확인
        </button>
      </div>
      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          <Show data={summary} />
        </Modal>
      )}
    </div>
  );
}

export default Checker;
