import React, { useState } from "react";
import api from "../../api/axiosInstance";

const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 유효성 검사
    if (!username || !password) {
      setErrors({
        username: !username ? "아이디를 입력해주세요" : "",
        password: !password ? "비밀번호를 입력해주세요" : "",
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", {
        username,
        password,
      });
      if (response.data && onLoginSuccess) {
        onLoginSuccess(response.data);
      }
    } catch (err) {
      const message = err.response?.data?.message || "로그인에 실패했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {error && <div className="error-message">{error}</div>}

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
          type={showPassword ? "text" : "password"}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && (
          <span className="error-text">{errors.password}</span>
        )}
      </div>

      <button type="button" onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
      </button>

      <button type="submit" disabled={loading}>
        {loading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
};

export default LoginForm;
