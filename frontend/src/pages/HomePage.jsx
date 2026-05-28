import React from "react";
import { useNavigate } from "react-router-dom";
import "./Page.css";
import "./HomePage.css";

export default function HomePage({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-logo">🏢 Roomy</h1>

        {/* 로그인 상태에 따라 조건부 렌더링 */}
        <div className="home-nav">
          {user ? (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="home-login-btn"
              >
                대시보드
              </button>
              <button onClick={onLogout} className="home-logout-btn">
                로그아웃
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="home-login-btn"
            >
              로그인
            </button>
          )}
        </div>
      </header>

      <main className="home-hero">
        <h2>스마트한 회의실 예약의 시작</h2>
        <p>
          동시성 제어 기술로 중복 예약 걱정 없는 실시간 회의실 예약 시스템을
          경험해보세요.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>⏰ 실시간 차집합 타임라인</h3>
            <p>
              운영 시간대별 예약 현황을 실시간 계산하여 예약 가능한 슬롯만
              직관적으로 활성화합니다.
            </p>
          </div>
          <div className="feature-card">
            <h3>🔒 고성능 동시성 제어</h3>
            <p>
              백엔드 비관적 락(Pessimistic Lock) 설계로 찰나의 순간에 발생하는
              중복 예약을 완벽히 방어합니다.
            </p>
          </div>
        </div>

        <div className="home-cta">
          <button
            onClick={() => navigate("/signup")}
            className="home-signup-btn"
          >
            지금 무료 가입하기
          </button>
        </div>
      </main>
    </div>
  );
}
