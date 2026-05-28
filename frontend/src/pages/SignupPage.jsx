import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. 추가
import { toast } from "react-hot-toast";
import api from "../api/axiosInstance";
import "./Page.css";
import "./SignupPage.css";

export default function SignupPage() {
  // onNavigate 제거
  const navigate = useNavigate(); // 2. 훅 선언
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const usernameRegex = /^[a-z0-9]{6,13}$/;
    if (!usernameRegex.test(username)) {
      setError("아이디는 6~13자의 영문 소문자 및 숫자여야 합니다.");
      return;
    }

    try {
      await api.post("/api/users/signup", { username, password });
      toast.success("회원가입이 완료되었습니다! 🎉");
      navigate("/login"); // 3. 수정
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <button className="home-back-btn" onClick={() => navigate("/")}>
        {" "}
        {/* 수정 */}← 홈으로 돌아가기
      </button>

      <h2 className="auth-title">Roomy 회원가입</h2>
      <form onSubmit={handleSignup} className="base-form">
        {/* ... 입력 폼 동일 ... */}
        <button type="submit" className="signup-btn">
          가입하기
        </button>
      </form>

      <div className="page-footer">
        이미 계정이 있으신가요?{" "}
        <span onClick={() => navigate("/login")} className="page-link">
          {" "}
          {/* 수정 */}
          로그인 페이지로 이동
        </span>
      </div>
    </div>
  );
}
