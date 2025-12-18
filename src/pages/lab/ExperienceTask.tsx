import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchExperienceTask, createTaskReview } from "../../api/lab";
import type { ExperienceTask } from "../../component/types";

interface ReviewPayload {
  rating: number;
  comment: string;
}
import "./ExperienceTask.css";

function ExperienceTaskPage() {
  const { labId, taskId } = useParams<{ labId: string; taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<ExperienceTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (labId && taskId) {
      loadTask(parseInt(labId), parseInt(taskId));
    }
  }, [labId, taskId]);

  const loadTask = async (labId: number, taskId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchExperienceTask(labId, taskId);
      setTask(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "과제 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!labId || !taskId || !reviewComment.trim()) {
      alert("후기를 작성해주세요.");
      return;
    }

    try {
      setSubmittingReview(true);
      const payload: ReviewPayload = {
        rating: reviewRating,
        comment: reviewComment.trim(),
      };
      await createTaskReview(parseInt(labId), parseInt(taskId), payload);
      setShowReviewForm(false);
      setReviewComment("");
      setReviewRating(5);
      // 후기 목록 새로고침
      if (labId && taskId) {
        loadTask(parseInt(labId), parseInt(taskId));
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "후기 작성에 실패했습니다.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
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

  if (loading) {
    return (
      <div className="experience-task-page">
        <div className="experience-task-loading">로딩 중...</div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="experience-task-page">
        <div className="experience-task-error">
          <p>{error || "과제 정보를 찾을 수 없습니다."}</p>
          <button onClick={() => navigate(`/labs/${labId}`)}>랩실로 돌아가기</button>
        </div>
      </div>
    );
  }

  const totalEstimatedTime = task.steps.reduce((sum, step) => sum + step.estimatedTime, 0);

  return (
    <div className="experience-task-page">
      <div className="experience-task-container">
        {/* 헤더 */}
        <div className="experience-task-header">
          <button
            className="experience-task-back"
            onClick={() => navigate(`/labs/${labId}`)}
          >
            ← 랩실로 돌아가기
          </button>
          <div className="experience-task-title-section">
            <div className="experience-task-title-header">
              <h1 className="experience-task-title">{task.title}</h1>
              <span
                className="experience-task-difficulty"
                style={{ backgroundColor: getDifficultyColor(task.difficulty) }}
              >
                {task.difficulty}
              </span>
            </div>
            <div className="experience-task-meta">
              <span className="experience-task-meta-item">
                ⏱ 예상 소요 시간: {task.estimatedTime}시간
              </span>
              {task.steps.length > 0 && (
                <span className="experience-task-meta-item">
                  📋 총 {task.steps.length}단계
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 설명 */}
        <div className="experience-task-section">
          <h2 className="experience-task-section-title">과제 소개</h2>
          <p className="experience-task-description">{task.description}</p>
        </div>

        {/* 선수 지식 */}
        {task.prerequisites && task.prerequisites.length > 0 && (
          <div className="experience-task-section">
            <h2 className="experience-task-section-title">선수 지식</h2>
            <div className="experience-task-prerequisites">
              {task.prerequisites.map((prereq, index) => (
                <span key={index} className="experience-task-prerequisite-tag">
                  {prereq}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 단계별 가이드 */}
        <div className="experience-task-section">
          <h2 className="experience-task-section-title">단계별 가이드</h2>
          <div className="experience-task-steps">
            {task.steps.map((step) => (
              <div key={step.stepNumber} className="experience-task-step">
                <div className="experience-task-step-header">
                  <div className="experience-task-step-number">{step.stepNumber}</div>
                  <h3 className="experience-task-step-title">{step.title}</h3>
                  <span className="experience-task-step-time">
                    ⏱ {step.estimatedTime}분
                  </span>
                </div>
                <p className="experience-task-step-description">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="experience-task-total-time">
            총 예상 소요 시간: {Math.round(totalEstimatedTime / 60)}시간{" "}
            {totalEstimatedTime % 60}분
          </div>
        </div>

        {/* 참고 자료 */}
        {task.resources && task.resources.length > 0 && (
          <div className="experience-task-section">
            <h2 className="experience-task-section-title">참고 자료</h2>
            <div className="experience-task-resources">
              {task.resources.map((resource) => (
                <div key={resource.id} className="experience-task-resource">
                  <div className="experience-task-resource-header">
                    <span className="experience-task-resource-type">{resource.type}</span>
                    <h3 className="experience-task-resource-title">{resource.title}</h3>
                  </div>
                  {resource.description && (
                    <p className="experience-task-resource-description">
                      {resource.description}
                    </p>
                  )}
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="experience-task-resource-link"
                    >
                      링크 열기 →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 후속 활동 가이드 */}
        {task.nextSteps && task.nextSteps.length > 0 && (
          <div className="experience-task-section">
            <h2 className="experience-task-section-title">후속 활동 가이드</h2>
            <ul className="experience-task-next-steps">
              {task.nextSteps.map((step, index) => (
                <li key={index} className="experience-task-next-step">
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 체험 후기 */}
        <div className="experience-task-section">
          <div className="experience-task-reviews-header">
            <h2 className="experience-task-section-title">
              체험 후기 ({task.reviews?.length || 0})
            </h2>
            <button
              className="experience-task-review-btn"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? "취소" : "후기 작성"}
            </button>
          </div>

          {/* 후기 작성 폼 */}
          {showReviewForm && (
            <div className="experience-task-review-form">
              <div className="experience-task-review-rating">
                <label>평점:</label>
                <div className="experience-task-review-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={`experience-task-review-star ${
                        star <= reviewRating ? "active" : ""
                      }`}
                      onClick={() => setReviewRating(star)}
                    >
                      ⭐
                    </button>
                  ))}
                  <span className="experience-task-review-rating-text">
                    {reviewRating}점
                  </span>
                </div>
              </div>
              <textarea
                className="experience-task-review-comment"
                placeholder="체험 후기를 작성해주세요..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={5}
              />
              <div className="experience-task-review-actions">
                <button
                  className="experience-task-review-submit"
                  onClick={handleSubmitReview}
                  disabled={submittingReview || !reviewComment.trim()}
                >
                  {submittingReview ? "작성 중..." : "후기 등록"}
                </button>
              </div>
            </div>
          )}

          {/* 후기 목록 */}
          {task.reviews && task.reviews.length > 0 ? (
            <div className="experience-task-reviews">
              {task.reviews.map((review) => (
                <div key={review.id} className="experience-task-review">
                  <div className="experience-task-review-header">
                    <div className="experience-task-review-user">
                      <span className="experience-task-review-user-id">
                        {review.userId}
                      </span>
                      <div className="experience-task-review-rating-display">
                        {"⭐".repeat(review.rating)}
                      </div>
                    </div>
                    <span className="experience-task-review-date">
                      {new Date(review.completedDate).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <p className="experience-task-review-content">{review.comment}</p>
                  {review.helpfulCount > 0 && (
                    <div className="experience-task-review-helpful">
                      👍 도움됨 {review.helpfulCount}명
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="experience-task-reviews-empty">
              아직 작성된 후기가 없습니다. 첫 후기를 작성해보세요!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExperienceTaskPage;

