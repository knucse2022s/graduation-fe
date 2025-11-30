import type {
  AdditionalRequirementKey,
  AdditionalRequirements,
} from "./types";
import "./AdditionalRequirements.css";

interface AdditionalRequirementsProps {
  requirements: AdditionalRequirements;
  onToggle?: (key: AdditionalRequirementKey) => void;
}

const LABELS: Record<AdditionalRequirementKey, string> = {
  English: "영어 요건",
  SDGs: "SDGs 교육",
  GraduationThesisAndCapstone: "졸업논문/캡스톤",
};

const DESCRIPTIONS: Partial<Record<AdditionalRequirementKey, string>> = {
  English: "졸업 전 영어 성적 또는 인증 제출 여부",
  SDGs: "SDGs 관련 교육 필수 이수 여부",
  GraduationThesisAndCapstone: "졸업 작품/논문 진행 여부",
};

function AdditionalRequirementsSection({
  requirements,
  onToggle,
}: AdditionalRequirementsProps) {
  const orderedKeys: AdditionalRequirementKey[] = [
    "English",
    "SDGs",
    "GraduationThesisAndCapstone",
  ];

  const entries = orderedKeys
    .map((key) => ({ key, data: requirements[key] }))
    .filter((entry) => entry.data);

  if (entries.length === 0) {
    return null;
  }

  return (
    <section className="additional-req-section">
      <h2 className="section-title">추가 이수 조건</h2>
      <div className="additional-req-grid">
        {entries.map(({ key, data }) => {
          if (!data) return null;
          const isCompleted = data.check;
          return (
            <div
              key={key}
              className={`additional-req-card ${
                isCompleted ? "completed" : "pending"
              }`}
            >
              <div className="additional-req-card-header">
                <h3>{LABELS[key]}</h3>
                <span className="additional-req-badge">
                  {isCompleted ? "충족" : "미충족"}
                </span>
              </div>
              {DESCRIPTIONS[key] && (
                <p className="additional-req-description">
                  {DESCRIPTIONS[key]}
                </p>
              )}
              <button
                type="button"
                className="additional-req-toggle"
                onClick={() => onToggle?.(key)}
              >
                {isCompleted ? "완료 취소" : "완료 표시"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default AdditionalRequirementsSection;
