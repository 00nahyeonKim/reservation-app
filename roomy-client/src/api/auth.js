import api from "./axiosInstance";

// 인증 관련 상태 관리 및 유틸리티
let currentUser = null;
const sessionStorageKey = "sessionId";
const userInfoStorageKey = "userInfo";

// 사용자 정보 가져오기
export function getUserInfo() {
  try {
    const userInfo = sessionStorage.getItem(userInfoStorageKey);
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    return null;
  } catch (error) {
    console.error("getUserInfo error:", error);
    return null;
  }
}

// 로그인 함수
export async function login(email, password) {
  try {
    const response = await api.post("/api/auth/login", { email, password });

    const { sessionId, userInfo } = response.data;

    // 세션과 사용자 정보를 세션 스토리지에 저장
    sessionStorage.setItem(sessionStorageKey, sessionId || "none");
    sessionStorage.setItem("userInfo", JSON.stringify(userInfo));

    currentUser = userInfo;

    return { success: true, sessionId, userInfo };
  } catch (error) {
    return {
      success: false,
      error: error.message || "로그인 실패",
    };
  }
}

// 회원가입 함수
export async function signup(username, email, password) {
  try {
    const response = await api.post("/api/auth/signup", {
      username,
      email,
      password,
    });

    const { sessionId, userInfo } = response.data;

    // 세션과 사용자 정보를 세션 스토리지에 저장
    sessionStorage.setItem(sessionStorageKey, sessionId || "none");
    sessionStorage.setItem("userInfo", JSON.stringify(userInfo));

    currentUser = userInfo;

    return { success: true, sessionId, userInfo };
  } catch (error) {
    return {
      success: false,
      error: error.message || "회원가입 실패",
    };
  }
}

// 로그아웃 함수
export function logout() {
  try {
    // 세션 스토리지 삭제
    sessionStorage.removeItem(sessionStorageKey);
    sessionStorage.removeItem("userInfo");

    // 현재 사용자 정보 초기화
    currentUser = null;

    console.log("로그아웃 완료");
  } catch (error) {
    console.error("로그아웃 중 오류 발생:", error);
  }
}

// 인증 상태 확인 함수
export function isAuthenticated() {
  const sessionId = sessionStorage.getItem(sessionStorageKey);
  return !!sessionId;
}

// 세션 확인 함수
export function hasSession() {
  return isAuthenticated();
}

// 현재 사용자 정보를 업데이트하는 함수
export function setUserInfo(userInfo) {
  currentUser = userInfo;
  localStorage.setItem("userInfo", JSON.stringify(userInfo));
}

// 현재 로그인 사용자 ID 를 가져오는 함수
export function getCurrentUserId() {
  if (currentUser) {
    return currentUser.id;
  }
  const userInfo = getUserInfo();
  if (userInfo) {
    return userInfo.id;
  }
  return null;
}
