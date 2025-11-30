import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth";
import "./design/Auth.css";

const MAJOR_OPTIONS = ["인공지능", "심화컴퓨터", "글로벌소프트웨어"] as const;

function Signup() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [major, setMajor] = useState<typeof MAJOR_OPTIONS[number]>(MAJOR_OPTIONS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!studentId || !password || !name) {
      setError("학번, 비밀번호, 이름을 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await signup({ studentId, password, name, major });
      setSuccess("회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>회원가입</h2>

        <div className="major-selector">
          {MAJOR_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`major-btn ${major === option ? "selected" : ""}`}
              onClick={() => setMajor(option)}
              disabled={isLoading}
            >
              {option}
            </button>
          ))}
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}
          <label htmlFor="signup-student-id">학번</label>
          <input
            id="signup-student-id"
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="학번을 입력하세요"
            disabled={isLoading}
          />

          <label htmlFor="signup-password">비밀번호</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            disabled={isLoading}
          />

          <label htmlFor="signup-name">이름</label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            disabled={isLoading}
          />

          <div className="auth-actions">
            <button type="submit" disabled={isLoading}>
              {isLoading ? "처리 중..." : "가입하기"}
            </button>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => navigate("/login")}
              disabled={isLoading}
            >
              로그인으로 이동
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
