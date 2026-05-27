import React, { useState } from "react";
import api from "../api/axiosInstance";
import "./Page.css";
import "./SignupPage.css";

export default function SignupPage({ onNavigate }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // 아이디 유효성 정규식 검사 (6~13자 영문 소문자 및 숫자)
    const usernameRegex = /^[a-z0-9]{6,13}$/;
    if (!usernameRegex.test(username)) {
      setError("아이디는 6~13자의 영문 소문자 및 숫자여야 합니다.");
      return;
    }

    try {
      await api.post("/api/users/signup", { username, password });
      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      onNavigate("login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Roomy 회원가입</h2>
      <p className="auth-subtitle">회의실 예약 시스템 계정을 생성하세요.</p>

      <form onSubmit={handleSignup} className="base-form">
        <div className="input-group">
          <label className="input-label">아이디</label>
          <input
            type="text"
            placeholder="6~13자 영문 소문자, 숫자"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="base-input"
          />
        </div>

        {/* 🛠️ 버그 수정: style={styles.inputGroup} 대신 일관성 있게 className으로 대체 */}
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

        <button type="submit" className="signup-btn">
          가입하기
        </button>
      </form>

      <div className="page-footer">
        이미 계정이 있으신가요?{" "}
        <span onClick={() => onNavigate("login")} className="page-link">
          로그인 페이지로 이동
        </span>
      </div>
    </div>
  );
}
