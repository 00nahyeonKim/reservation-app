import React, { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import api from "./api/axiosInstance";
import "./pages/Page.css";

export default function App() {
  const [view, setView] = useState("home"); // 초기 진입을 랜딩 페이지(home)로 설정
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await api.get("/api/users/me");
      if (res.data) {
        setUser(res.data);
        setView("dashboard"); // 세션이 유효하면 대시보드로 다이렉트 패스
      }
    } catch (err) {
      setView("home"); // 인증 안 되어 있으면 소개 페이지 노출
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setView("dashboard");
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/users/logout");
      setUser(null);
      setView("home"); // 로그아웃 시 서비스 첫 메인 화면으로 전환
    } catch (err) {
      alert("로그아웃 실패: " + err.message);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "100px",
          fontSize: "20px",
        }}
      >
        앱 초기화 중...
      </div>
    );
  }

  return (
    <div>
      {view === "home" && <HomePage onNavigate={setView} />}
      {view === "login" && (
        <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={setView} />
      )}
      {view === "signup" && <SignupPage onNavigate={setView} />}
      {view === "dashboard" && (
        <DashboardPage user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}
