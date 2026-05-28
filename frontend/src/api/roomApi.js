// frontend/src/api/roomApi.js
import axiosInstance from "./axiosInstance";

export const getMeetingRooms = async () => {
  const response = await axiosInstance.get("/api/rooms"); // 백엔드 컨트롤러 경로에 맞춰주세요
  return response.data;
};
