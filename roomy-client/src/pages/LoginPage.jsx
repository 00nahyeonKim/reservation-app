import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const router = useRouter();
  const { isAuthenticated, user, login } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleLoginSuccess = async (email, password) => {
    try {
      setError("");
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userInfo = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
        };
        await login(userInfo);
        router.push("/dashboard");
      } else {
        setError(data.message || "로그인 실패");
      }
    } catch (err) {
      setError("로그인 중 오류 발생");
    }
  };

  const handleLoginFromForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    await handleLoginSuccess(email, password);
  };

  return (
    <div className="page-container">
      <div className="login-wrapper">
        <div className="login-page">
          {error && <div className="error-message">{error}</div>}
          <h2>로그인</h2>
          <form onSubmit={handleLoginFromForm} className="login-form">
            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password || ""}
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
      </div>
    </div>
  );
};

export default LoginPage;
