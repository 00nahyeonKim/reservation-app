import { useState } from "react";
import axios from "../../api/axiosInstance";

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const { token, userInfo } = response.data;

      // 토큰과 사용자 정보를 localStorage 에 저장
      localStorage.setItem("authToken", token);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      onLoginSuccess(userInfo);
    } catch (err) {
      setError(err.message || "로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <h2>로그인</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
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
