import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyGraduationData, login } from "../api/auth";
import "./design/Auth.css";

function Login() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!studentId || !password) {
      setError("학번과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await login({ studentId, password });
      const graduationData = await fetchMyGraduationData();
      navigate("/checker", { state: graduationData });
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>로그인</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="auth-error">{error}</p>}
          <label htmlFor="login-student-id">학번</label>
          <textarea
            id="login-student-id"
            rows={1}
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="학번을 입력하세요"
            disabled={isLoading}
          />

          <label htmlFor="login-password">비밀번호</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            disabled={isLoading}
          />

          <div className="auth-actions">
            <button type="submit" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "확인"}
            </button>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => navigate("/signup")}
              disabled={isLoading}
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
