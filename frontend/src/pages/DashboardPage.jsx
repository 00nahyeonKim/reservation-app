import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. 라우터 훅 추가
import { toast } from "react-hot-toast"; // 2. 토스트 라이브러리 추가
import * as roomApi from "../api/roomApi";
import "./Page.css";
import "./DashboardPage.css";

export default function DashboardPage({ user, onLogout }) {
  const navigate = useNavigate(); // 3. 훅 선언

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [reservedSlots, setReservedSlots] = useState([]);
  const [myReservations, setMyReservations] = useState([]);

  const allSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    if (selectedRoom && selectedDate) fetchReservedSlots();
  }, [selectedRoom, selectedDate]);

  const initData = async () => {
    try {
      const [roomRes, resRes] = await Promise.all([
        roomApi.getRooms(),
        roomApi.getMyReservations(),
      ]);
      setRooms(roomRes.data);
      if (roomRes.data.length > 0) setSelectedRoom(roomRes.data[0]);
      setMyReservations(resRes.data);
    } catch (err) {
      toast.error("데이터 로드 실패: " + err.message);
    }
  };

  const fetchReservedSlots = async () => {
    try {
      const res = await roomApi.getReservedSlots(selectedRoom.id, selectedDate);
      setReservedSlots(
        res.data.filter((r) => r.status === "RESERVED").map((r) => r.startTime),
      );
    } catch (err) {
      toast.error("슬롯 조회 실패");
    }
  };

  const handleReservation = async (startTime) => {
    const startHour = parseInt(startTime.split(":")[0]);
    const endTime = `${startHour + 1 < 10 ? "0" + (startHour + 1) : startHour + 1}:00`;
    try {
      await roomApi.createReservation({
        roomId: selectedRoom.id,
        reservationDate: selectedDate,
        startTime,
        endTime,
      });
      toast.success("🎉 예약이 완료되었습니다!"); // 4. 알림 개선
      fetchReservedSlots();
      const res = await roomApi.getMyReservations();
      setMyReservations(res.data);
    } catch (err) {
      toast.error("예약 실패: " + err.message);
    }
  };

  const handleCancelReservation = async (id) => {
    if (!window.confirm("정말 이 예약을 취소하시겠습니까?")) return;
    try {
      await roomApi.cancelReservation(id);
      toast.success("✅ 예약이 취소되었습니다."); // 5. 알림 개선

      const [resList, slotRes] = await Promise.all([
        roomApi.getMyReservations(),
        selectedRoom
          ? roomApi.getReservedSlots(selectedRoom.id, selectedDate)
          : Promise.resolve({ data: [] }),
      ]);
      setMyReservations(resList.data);
      if (selectedRoom) {
        setReservedSlots(
          slotRes.data
            .filter((r) => r.status === "RESERVED")
            .map((r) => r.startTime),
        );
      }
    } catch (err) {
      toast.error("취소 실패: " + err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          {/* 클래스명을 dashboard-home-btn으로 통일 */}
          <button className="dashboard-home-btn" onClick={() => navigate("/")}>
            ← 홈으로
          </button>
          <h1 className="dashboard-logo">🏢 Roomy Dashboard</h1>
        </div>

        <div className="user-info">
          <span className="username-text">
            <strong>{user.username}</strong> 님
          </span>
          <button onClick={onLogout} className="logout-btn">
            로그아웃
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {/* ... 기존 내용 동일 ... */}
        <section className="dashboard-card">
          <h3 className="card-title">⏰ 회의실 실시간 예약 현황</h3>
          <div className="filter-group">
            <div className="select-box">
              <label className="input-label">회의실 선택</label>
              <select
                onChange={(e) =>
                  setSelectedRoom(
                    rooms.find((r) => r.id === parseInt(e.target.value)),
                  )
                }
                className="filter-select"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} (수용: {r.capacity}명)
                  </option>
                ))}
              </select>
            </div>
            <div className="select-box">
              <label className="input-label">날짜 선택</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="filter-date"
              />
            </div>
          </div>
          {/* ... (생략: 슬롯 렌더링 부분) ... */}
        </section>
        {/* ... (생략: 나의 예약 내역 테이블) ... */}
      </main>
    </div>
  );
}
