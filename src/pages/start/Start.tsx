import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/background.jpg";
import logoImage from "../../assets/logo_knu.png";
import { fetchMyGraduationData } from "../../api/auth";
import "./Start.css";

function Start() {
  const navigate = useNavigate();

  const handleGoClick = async () => {
    // localStorage에 accessToken이 있는지 확인
    const accessToken = localStorage.getItem("accessToken");
    
    if (!accessToken) {
      // 로그인되어 있지 않으면 로그인 페이지로 이동
      navigate("/login");
      return;
    }

    // 로그인되어 있으면 데이터를 가져와서 Checker 페이지로 이동
    try {
      const graduationData = await fetchMyGraduationData();
      navigate("/checker", { state: graduationData });
    } catch (error) {
      // 토큰이 유효하지 않거나 데이터를 가져올 수 없으면 로그인 페이지로 이동
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  };

  return (
    <div className="start-page">
      {/* Header */}
      <header className="start-header">
        <div className="start-header-left">
          <div className="start-logo">
          <img src={logoImage} alt="경북대학교 로고" className="start-logo-image" />
          </div>
        </div>
        <nav className="start-header-nav">
          <a href="#" className="start-nav-link">대학소개</a>
          <span className="start-nav-divider">|</span>
          <a href="#" className="start-nav-link">입학</a>
          <span className="start-nav-divider">|</span>
          <button
            className="start-nav-link start-nav-button"
            onClick={() => navigate("/login")}
          >
            로그인
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="start-main">
        <div
          className="start-background"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
        <div className="start-content">
          <h1 className="start-title">
            경북대학교 졸업요건 확인 서비스
          </h1>
          <button className="start-go-button" onClick={handleGoClick}>
            <span>바로가기</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="start-footer">
        <div className="start-footer-content">
          <p className="start-footer-address">
            91415068 대구광역시 북구 대학로 80 (산격동, 경북대학교)
          </p>
          <p className="start-footer-contact">
            학교안내전화 053-950-5114 | 직통 053-960-6000
          </p>
          <p className="start-footer-copyright">
            Copyright(c) Kyungpook National University. All rights reserved.
          </p>
          <div className="start-footer-stats">
            <span>오늘 방문자수: 267</span>
            <span>총 방문자수: 154,572</span>
            <span>36,278</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Start;

