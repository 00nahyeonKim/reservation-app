import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./pages/Page.css"; // 앱 전체에 공통 초기화 및 폰트 스타일 반영

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
