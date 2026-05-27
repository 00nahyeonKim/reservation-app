import React, { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import "./Page.css";
import "./DashboardPage.css";

export default function DashboardPage({ user, onLogout }) {
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
    fetchRooms();
    fetchMyReservations();
  }, []);

  useEffect(() => {
    if (selectedRoom && selectedDate) {
      fetchReservedSlots();
    }
  }, [selectedRoom, selectedDate]);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/api/rooms");
      setRooms(res.data);
      if (res.data.length > 0) setSelectedRoom(res.data[0]);
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchReservedSlots = async () => {
    try {
      const res = await api.get(
        `/api/reservations?roomId=${selectedRoom.id}&date=${selectedDate}`,
      );
      const activeStarts = res.data
        .filter((r) => r.status === "RESERVED")
        .map((r) => r.startTime);
      setReservedSlots(activeStarts);
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchMyReservations = async () => {
    try {
      const res = await api.get("/api/reservations/my");
      setMyReservations(res.data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReservation = async (startTime) => {
    const startHour = parseInt(startTime.split(":")[0]);
    const endTime = `${startHour + 1 < 10 ? "0" + (startHour + 1) : startHour + 1}:00`;

    try {
      await api.post("/api/reservations", {
        roomId: selectedRoom.id,
        reservationDate: selectedDate,
        startTime,
        endTime,
      });
      alert("🎉 예약이 성공적으로 완료되었습니다!");
      fetchReservedSlots();
      fetchMyReservations();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancelReservation = async (id) => {
    if (!confirm("정말 이 예약을 취소하시겠습니까?")) return;
    try {
      await api.delete(`/api/reservations/${id}`);
      alert("예약이 취소되었습니다.");
      fetchMyReservations();
      if (selectedRoom) fetchReservedSlots();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2 className="dashboard-logo">🏢 Roomy Dashboard</h2>
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

          {selectedRoom && (
            <div className="timeline-container">
              <p className="timeline-info">
                💡 <strong>{selectedRoom.name}</strong>의 예약 가능 슬롯입니다.
              </p>
              <div className="slot-grid">
                {allSlots.map((slot) => {
                  const isReserved = reservedSlots.includes(slot);
                  return (
                    <button
                      key={slot}
                      disabled={isReserved}
                      onClick={() => handleReservation(slot)}
                      className="slot-button"
                      style={{
                        backgroundColor: isReserved ? "#e2e8f0" : "#3182ce",
                        color: isReserved ? "#a0aec0" : "#ffffff",
                      }}
                    >
                      <span className="slot-time">{slot}</span>
                      <span className="slot-status">
                        {isReserved ? "예약 마감" : "예약 가능"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <section className="dashboard-card">
          <h3 className="card-title">📋 나의 예약 신청 내역</h3>
          <div className="table-wrapper">
            <table className="res-table">
              <thead>
                <tr className="th-row">
                  <th className="table-th">회의실</th>
                  <th className="table-th">예약 날짜</th>
                  <th className="table-th">이용 시간</th>
                  <th className="table-th">상태</th>
                  <th className="table-th">관리</th>
                </tr>
              </thead>
              <tbody>
                {myReservations.map((res) => (
                  <tr key={res.id} className="td-row">
                    <td className="table-td">{res.roomName}</td>
                    <td className="table-td">{res.reservationDate}</td>
                    <td className="table-td">
                      {res.startTime} ~ {res.endTime}
                    </td>
                    <td className="table-td">
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor:
                            res.status === "RESERVED" ? "#e6fffa" : "#fff5f5",
                          color:
                            res.status === "RESERVED" ? "#319795" : "#e53e3e",
                        }}
                      >
                        {res.status === "RESERVED" ? "예약 완료" : "취소됨"}
                      </span>
                    </td>
                    <td className="table-td">
                      {res.status === "RESERVED" && (
                        <button
                          onClick={() => handleCancelReservation(res.id)}
                          className="cancel-btn"
                        >
                          취소하기
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {myReservations.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-td">
                      신청하신 예약 내역이 존재하지 않습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
