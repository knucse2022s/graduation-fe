import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { facultyData } from "../../data/facultyData";
import { getRecruitmentStatus } from "../../api/recruitment";
import { getFacultyDetail } from "../../api/facultyDetail";
import { getComments, createComment, toggleCommentLike } from "../../api/comments";
import type { Faculty, FacultyDetail, Comment } from "../../component/types";
import "./FacultyDetail.css";

function FacultyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [professor, setProfessor] = useState<Faculty | null>(null);
  const [detail, setDetail] = useState<FacultyDetail | null>(null);
  const [isRecruiting, setIsRecruiting] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likingCommentId, setLikingCommentId] = useState<number | null>(null);

  // localStorage에서 좋아요를 누른 댓글 ID 목록 가져오기
  const getLikedComments = (): Set<number> => {
    try {
      const liked = localStorage.getItem('liked_comments');
      if (liked) {
        const likedArray = JSON.parse(liked) as number[];
        return new Set(likedArray);
      }
    } catch (error) {
      console.error('Error reading liked comments from localStorage:', error);
    }
    return new Set<number>();
  };

  // localStorage에 좋아요를 누른 댓글 ID 저장
  const saveLikedComment = (commentId: number) => {
    try {
      const liked = getLikedComments();
      liked.add(commentId);
      localStorage.setItem('liked_comments', JSON.stringify(Array.from(liked)));
    } catch (error) {
      console.error('Error saving liked comment to localStorage:', error);
    }
  };

  // 좋아요를 누른 댓글인지 확인
  const isCommentLiked = (commentId: number): boolean => {
    return getLikedComments().has(commentId);
  };

  const loadProfessorData = async (professorId: number) => {
    try {
      setLoading(true);
      const foundProfessor = facultyData.find((p) => p.id === professorId);
      
      if (!foundProfessor) {
        setProfessor(null);
        return;
      }

      setProfessor(foundProfessor);
      
      // 모집 여부 조회
      const recruitingStatus = await getRecruitmentStatus(professorId);
      setIsRecruiting(recruitingStatus);

      // 상세 정보 조회
      const facultyDetail = await getFacultyDetail(professorId);
      setDetail(facultyDetail);

      // 댓글 조회
      const commentsData = await getComments(professorId);
      // localStorage에서 좋아요 정보 확인하여 isLiked 설정
      const likedComments = getLikedComments();
      const commentsWithLiked = commentsData.map((comment) => ({
        ...comment,
        isLiked: likedComments.has(comment.id),
      }));
      setComments(commentsWithLiked);
    } catch (error) {
      console.error("Error loading professor data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadProfessorData(parseInt(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmitComment = async () => {
    if (!commentContent.trim() || !id) {
      return;
    }

    try {
      setSubmittingComment(true);
      const newComment = await createComment(parseInt(id), {
        content: commentContent.trim(),
      });
      setComments((prev) => [newComment, ...prev]);
      setCommentContent("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "댓글 작성에 실패했습니다.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (likingCommentId === commentId) return;
    
    // 이미 좋아요를 누른 댓글이면 막기
    if (isCommentLiked(commentId)) {
      alert("이미 좋아요를 누른 댓글입니다.");
      return;
    }

    try {
      setLikingCommentId(commentId);
      const newLikeCount = await toggleCommentLike(commentId);
      
      // localStorage에 저장
      saveLikedComment(commentId);
      
      // 댓글 상태 업데이트
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, likeCount: newLikeCount, isLiked: true }
            : comment
        )
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "좋아요에 실패했습니다.");
    } finally {
      setLikingCommentId(null);
    }
  };


  if (loading) {
    return (
      <div className="faculty-detail-page">
        <div className="faculty-detail-loading">로딩 중...</div>
      </div>
    );
  }

  if (!professor) {
    return (
      <div className="faculty-detail-page">
        <div className="faculty-detail-error">
          <p>교수진 정보를 찾을 수 없습니다.</p>
          <button onClick={() => navigate("/faculty")}>목록으로 돌아가기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="faculty-detail-page">
      <div className="faculty-detail-container">
        {/* 헤더 */}
        <div className="faculty-detail-header">
          <button
            className="faculty-detail-back"
            onClick={() => navigate("/faculty")}
          >
            ← 목록으로
          </button>
        </div>

        {/* 프로필 섹션 */}
        <div className="faculty-detail-profile">
          <div className="faculty-detail-image-section">
            {professor.imageUrl ? (
              <img
                src={professor.imageUrl}
                alt={professor.name}
                className="faculty-detail-image"
              />
            ) : (
              <div className="faculty-detail-image-placeholder">
                {professor.name.charAt(0)}
              </div>
            )}
            {/* 모집 여부 배지 */}
            <div
              className={`faculty-detail-recruitment-badge ${
                isRecruiting ? "recruiting" : "not-recruiting"
              }`}
            >
              <span className="faculty-detail-recruitment-dot"></span>
              <span className="faculty-detail-recruitment-text">
                {isRecruiting ? "학부연구생 모집 중" : "학부연구생 모집 안함"}
              </span>
            </div>
          </div>

          <div className="faculty-detail-info">
            <h1 className="faculty-detail-name">{professor.name}</h1>
            {professor.title && (
              <p className="faculty-detail-title">{professor.title}</p>
            )}

            <div className="faculty-detail-contact">
              {professor.phone && (
                <div className="faculty-detail-contact-item">
                  <span className="faculty-detail-contact-label">전화번호</span>
                  <a href={`tel:${professor.phone}`} className="faculty-detail-contact-value">
                    {professor.phone}
                  </a>
                </div>
              )}
              {professor.email && (
                <div className="faculty-detail-contact-item">
                  <span className="faculty-detail-contact-label">이메일</span>
                  <a
                    href={`mailto:${professor.email}`}
                    className="faculty-detail-contact-value"
                  >
                    {professor.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 추가 정보 섹션 */}
        <div className="faculty-detail-sections">
          {/* 연구 분야 */}
          {detail?.researchField && (
            <div className="faculty-detail-section">
              <h2 className="faculty-detail-section-title">연구 분야</h2>
              <p className="faculty-detail-section-content">{detail.researchField}</p>
            </div>
          )}

          {/* 개설 교과목 */}
          {detail?.courses && detail.courses.length > 0 && (
            <div className="faculty-detail-section">
              <h2 className="faculty-detail-section-title">개설 교과목</h2>
              <div className="faculty-detail-courses">
                {detail.courses.map((course) => (
                  <div key={course.id} className="faculty-detail-course-item">
                    <div className="faculty-detail-course-header">
                      <h3 className="faculty-detail-course-name">{course.name}</h3>
                      {course.code && (
                        <span className="faculty-detail-course-code">{course.code}</span>
                      )}
                    </div>
                    {course.description && (
                      <p className="faculty-detail-course-description">{course.description}</p>
                    )}
                    {course.semester && (
                      <span className="faculty-detail-course-semester">{course.semester}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 주요 논문 */}
          {detail?.papers && detail.papers.length > 0 && (
            <div className="faculty-detail-section">
              <h2 className="faculty-detail-section-title">주요 논문</h2>
              <div className="faculty-detail-papers">
                {detail.papers.map((paper) => (
                  <div key={paper.id} className="faculty-detail-paper-item">
                    <h3 className="faculty-detail-paper-title">{paper.title}</h3>
                    <div className="faculty-detail-paper-meta">
                      {paper.authors && paper.authors.length > 0 && (
                        <span className="faculty-detail-paper-authors">
                          {paper.authors.join(", ")}
                        </span>
                      )}
                      {paper.journal && (
                        <span className="faculty-detail-paper-journal">{paper.journal}</span>
                      )}
                      {paper.year && (
                        <span className="faculty-detail-paper-year">{paper.year}</span>
                      )}
                    </div>
                    {(paper.url || paper.doi) && (
                      <div className="faculty-detail-paper-links">
                        {paper.url && (
                          <a
                            href={paper.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="faculty-detail-paper-link"
                          >
                            논문 보기 →
                          </a>
                        )}
                        {paper.doi && (
                          <a
                            href={`https://doi.org/${paper.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="faculty-detail-paper-link"
                          >
                            DOI: {paper.doi}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 이 분야를 오기 위한 조언 */}
          {detail?.advice && (
            <div className="faculty-detail-section">
              <h2 className="faculty-detail-section-title">
                이 분야를 오기 위해서는?
              </h2>
              <div className="faculty-detail-advice">
                <p className="faculty-detail-advice-content">{detail.advice}</p>
              </div>
            </div>
          )}

          {/* 연구실 소개 */}
          {detail?.labIntroduction && (
            <div className="faculty-detail-section">
              <h2 className="faculty-detail-section-title">연구실 소개</h2>
              <div className="faculty-detail-lab-intro">
                <p className="faculty-detail-section-content">{detail.labIntroduction}</p>
              </div>
            </div>
          )}

          {/* 정보가 없는 경우 */}
          {(!detail || (!detail.researchField && (!detail.courses || detail.courses.length === 0) && (!detail.papers || detail.papers.length === 0) && !detail.advice && !detail.labIntroduction)) && (
            <div className="faculty-detail-section">
              <p className="faculty-detail-empty-message">
                상세 정보가 아직 등록되지 않았습니다.
              </p>
            </div>
          )}

          {/* 댓글 섹션 */}
          <div className="faculty-detail-section">
            <h2 className="faculty-detail-section-title">
              댓글 ({comments.length})
            </h2>

            {/* 댓글 작성 폼 */}
            <div className="faculty-detail-comment-form">
              <textarea
                className="faculty-detail-comment-input"
                placeholder="익명으로 댓글을 작성해주세요..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                rows={4}
                disabled={submittingComment}
              />
              <div className="faculty-detail-comment-form-actions">
                <span className="faculty-detail-comment-hint">
                  💬 익명으로 작성됩니다
                </span>
                <button
                  className="faculty-detail-comment-submit"
                  onClick={handleSubmitComment}
                  disabled={submittingComment || !commentContent.trim()}
                >
                  {submittingComment ? "작성 중..." : "댓글 작성"}
                </button>
              </div>
            </div>

            {/* 댓글 목록 */}
            {comments.length === 0 ? (
              <div className="faculty-detail-comments-empty">
                아직 작성된 댓글이 없습니다. 첫 댓글을 작성해보세요!
              </div>
            ) : (
              <div className="faculty-detail-comments">
                {comments.map((comment) => (
                  <div key={comment.id} className="faculty-detail-comment">
                    <div className="faculty-detail-comment-header">
                      <div className="faculty-detail-comment-author">
                        <span className="faculty-detail-comment-name">
                          {comment.anonymousName}
                        </span>
                      </div>
                    </div>
                    <p className="faculty-detail-comment-content">
                      {comment.content}
                    </p>
                    <div className="faculty-detail-comment-actions">
                      <button
                        className={`faculty-detail-comment-like ${
                          comment.isLiked ? "liked" : ""
                        }`}
                        onClick={() => handleLikeComment(comment.id)}
                        disabled={likingCommentId === comment.id || comment.isLiked}
                        title={comment.isLiked ? "이미 좋아요를 누른 댓글입니다" : ""}
                      >
                        <span className="faculty-detail-comment-like-icon">👍</span>
                        <span className="faculty-detail-comment-like-count">
                          {comment.likeCount}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyDetailPage;

