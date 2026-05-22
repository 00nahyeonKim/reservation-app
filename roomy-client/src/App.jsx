import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Logo from "./assets/logo.png";
import "./App.css";

function App() {
  const { isAuth } = useAuth();

  return (
    <>
      <header className="app-header">
        <nav className="nav-container">
          <Link to="/" className="logo-link">
            <img src={Logo} alt="Roomy Logo" />
            <span>Roomy</span>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">
              홈
            </Link>
            {isAuth ? (
              <>
                <Link to="/login" className="nav-link">
                  로그인
                </Link>
                <Link to="/signup" className="nav-link">
                  회원가입
                </Link>
              </>
            ) : (
              <Link to="/login" className="nav-link">
                로그인
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>Roomy Reservation System © 2026</p>
      </footer>
    </>
  );
}

function HomePage() {
  const { isAuth, isAuthenticated } = useAuth();

  return (
    <section className="hero-section">
      <div className="hero-container">
        <h1 className="hero-title">Roomy</h1>
        <p className="hero-subtitle">
          공간 예약 플랫폼에서 당신의 시간을 최적화하세요
        </p>
      </div>
    </section>
  );
}

export default App;
