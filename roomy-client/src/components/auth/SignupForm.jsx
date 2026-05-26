import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosInstance";

const SignupForm = ({ onSignupSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      setErrors({
        username: "아이디를 입력해주세요",
        email: "이메일을 입력해주세요",
        password: "비밀번호를 입력해주세요",
        confirmPassword: "비밀번호 확인을 입력해주세요",
      });
      return false;
    }
    return true;
  };

  const validateCredentials = () => {
    if (username.length < 6 || username.length > 13) {
      setErrors({ username: "아이디는 6~13 자까지 입력해주세요" });
      return false;
    }
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "비밀번호가 일치하지 않습니다" });
      return false;
    }
    if (password.length < 8) {
      setErrors({ password: "비밀번호는 최소 8 자 이상 입력해주세요" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || !validateCredentials()) {
      return;
    }

    setLoading(true);

    try {
      const result = await api.post("/api/auth/signup", {
        username,
        email,
        password,
      });

      // Spring Boot REST API 는 ResponseEntity<SignupResponseDto> 로 JSON 객체 전체를 반환합니다.
      // axios.defaults.withCredentials = true 설정으로 Spring Session 의 세션 쿠키 (JSESSIONID) 가 자동으로 처리됩니다.

      const data = result.data || result;

      // ✅ SignupResponseDto 가 반환됨
      if (data) {
        navigate("/dashboard");

        setErrors({});
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError("회원가입 실패했습니다.");
        setErrors({ username: "" });
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "회원가입 실패했습니다";
      setError(message);
      setErrors({ username: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-form">
      <h2>회원가입</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">아이디</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="6~13 자 영문/숫자"
          />
          {errors.username && (
            <span className="error-text">{errors.username}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="예: example@email.com"
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="8 자 이상 입력"
          />
          {errors.password && (
            <span className="error-text">{errors.password}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errors.confirmPassword && (
            <span className="error-text">{errors.confirmPassword}</span>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "회원가입 중..." : "회원가입"}
        </button>
      </form>

      <div className="signup-footer">
        <p>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
