import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrors({
        username: "아이디를 입력해주세요",
        password: "비밀번호를 입력해주세요",
      });
      return;
    }

    if (username.length < 6 || username.length > 13) {
      setErrors({ username: "아이디는 6~13 자까지 입력해주세요" });
      return;
    }

    setErrors({ username: "" });
    setLoading(true);

    try {
      const result = await api.post("/api/auth/login", {
        username,
        password,
      });

      // Spring Boot REST API 는 ResponseEntity<LoginResponseDto> 로 JSON 객체 전체를 반환합니다.
      // axios.defaults.withCredentials = true 설정으로 Spring Session 의 세션 쿠키 (JSESSIONID) 가 자동으로 처리됩니다.

      const data = result.data || result;

      // ✅ LoginResponseDto 가 반환됨 (id, username, email 필드 포함)
      if (data) {
        navigate("/dashboard");

        setErrors({});
        setUsername("");
        setPassword("");
      } else {
        setError("로그인 실패했습니다.");
        setErrors({ username: "" });
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "로그인 실패했습니다";
      setError(message);
      setErrors({ username: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <h2>로그인</h2>

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
          />
          {errors.username && (
            <span className="error-text">{errors.username}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && (
            <span className="error-text">{errors.password}</span>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className="login-footer">
        <p>
          계정이 없으신가요? <a href="/signup">회원가입</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
