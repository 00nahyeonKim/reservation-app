import React, { useState } from "react";
import api from "../api/axiosInstance";
import "./Page.css"; // 공통 스타일 임포트
import "./LoginPage.css"; // 개별 스타일 임포트

export default function LoginPage({ onLoginSuccess, onNavigate }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/api/users/login", {
        username,
        password,
      });
      onLoginSuccess(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Roomy 로그인</h2>
      <p className="auth-subtitle">
        동시성 제어 회의실 예약 시스템에 로그인하세요.
      </p>

      <form onSubmit={handleLogin} className="base-form">
        <div className="input-group">
          <label className="input-label">아이디</label>
          <input
            type="text"
            placeholder="아이디를 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="base-input"
          />
        </div>

        <div className="input-group">
          <label className="input-label">비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="base-input"
          />
        </div>

        {error && <div className="error-box">{error}</div>}

        <button type="submit" className="login-btn">
          로그인
        </button>
      </form>

      <div className="page-footer">
        아직 계정이 없으신가요?{" "}
        <span onClick={() => onNavigate("signup")} className="page-link">
          회원가입 페이지로 이동
        </span>
      </div>
    </div>
  );
}
