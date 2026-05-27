// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";

// AuthContext를 export 해야 App.jsx에서 가져올 수 있습니다.
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(!!sessionStorage.getItem("username"));

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
