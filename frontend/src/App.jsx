import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import api from "./api/axiosInstance";
import "./pages/Page.css";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await api.get("/api/users/me");
      if (res.data) setUser(res.data);
    } catch (err) {
      // 세션 없음 (로그인 안 된 상태)
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/users/logout");
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      alert("로그아웃 실패: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="app-loading-container">
        <div className="app-loading-emoji">🏢</div>
        <div className="app-loading-text">Roomy 로딩 중...</div>
      </div>
    );
  }

  // App.jsx의 return 문 내부 Routes 수정
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ maxToasts: 3 }} />
      <Routes>
        <Route
          path="/"
          element={<HomePage user={user} onLogout={handleLogout} />} // user 정보와 로그아웃 함수 전달
        />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginPage onLoginSuccess={setUser} />
            )
          }
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              <DashboardPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
