import { useState } from "react";
import axios from "../../api/axiosInstance";

const SignupForm = ({ onSignupSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // 6~13 자 ID 검증
    if (!username.match(/^[a-zA-Z0-9]{6,13}$/)) {
      setError("아이디는 6~13 자 영문/숫자로 입력해야 합니다.");
      return;
    }

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 비밀번호 최소 길이
    if (password.length < 8) {
      setError("비밀번호는 최소 8 자 이상 입력해야 합니다.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/auth/signup", {
        username,
        email,
        password,
      });

      const { token, userInfo } = response.data;

      // 토큰과 사용자 정보를 localStorage 에 저장
      localStorage.setItem("authToken", token);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      onSignupSuccess(userInfo);
    } catch (err) {
      setError(err.message || "회원가입 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-form">
      <h2>회원가입</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label htmlFor="username">아이디</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            maxLength="13"
            placeholder="6~13 자 영문/숫자"
          />
        </div>

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
            minLength={8}
          />
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
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "회원가입 중..." : "회원가입"}
        </button>
      </form>

      <div className="signup-footer">
        <p>
          이미 계정이 있으신가요? <a href="/login">로그인</a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
