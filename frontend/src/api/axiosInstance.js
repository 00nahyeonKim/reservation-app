import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// 기본 axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 응답 인터셉터 - 응답 처리
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Axios 에러:", error);

    // 에러 코드에 따른 처리
    if (error.response) {
      const { status, data } = error.response;

      // 인증 에러 (401) 처리
      if (status === 401) {
        return Promise.reject(new Error("세션 만료되었습니다."));
      }

      // 비관적 락 에러 (409)
      if (status === 409) {
        return Promise.reject(new Error("동시 예약이 불가능합니다."));
      }

      // 일반적인 에러 처리
      if (data && data.message) {
        return Promise.reject(new Error(data.message));
      }
      return Promise.reject(new Error(`서버 에러 (${status})`));
    }

    // 네트워크 에러 처리
    if (error.message.includes("timeout")) {
      return Promise.reject(new Error("요청 시간 초과되었습니다."));
    }
    if (error.message.includes("network")) {
      return Promise.reject(new Error("네트워크 오류가 발생했습니다."));
    }

    return Promise.reject(error);
  },
);

export default api;
