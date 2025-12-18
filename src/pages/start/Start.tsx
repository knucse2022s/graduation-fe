import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/background.jpg";
import logoImage from "../../assets/logo_knu.png";
import "./Start.css";

function Start() {
  const navigate = useNavigate();

  const handleGoClick = () => {
    // 교수진 목록 페이지로 이동
    navigate("/faculty");
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
            컴퓨터학부 랩실 
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
            대구광역시 북구 대학로 80 (산격동, 경북대학교)
          </p>
          <p className="start-footer-contact">
            학교안내전화 053-950-5114 | 직통 053-960-6000
          </p>
          <p className="start-footer-copyright">
            Copyright(c) Kyungpook National University. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Start;

