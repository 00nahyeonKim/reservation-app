import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roomTimeSlots, setRoomTimeSlots] = useState({});

  useEffect(() => {
    setRoomTimeSlots({});
    setError(null);
    // 사용자가 필요한 회의실만 수동으로 조회
  }, [selectedDate]);

  // 세션 인증 로직
  useEffect(() => {
    const checkSession = () => {
      const username = sessionStorage.getItem("username");
      const password = sessionStorage.getItem("password");

      if (!username || !password) {
        navigate("/login");
        return;
      }
    };
    checkSession();
  }, [navigate]);

  const fetchAvailableTimeSlots = async (roomId) => {
    try {
      const response = await api.get(
        `/api/rooms/timeslots?room-id=${roomId}&date=${selectedDate}`,
      );
      setRoomTimeSlots((prev) => ({ ...prev, [roomId]: response.data }));
    } catch (err) {
      setError("회의실 타임 슬롯 조회에 실패했습니다.");
    }
  };

  const handleReservation = async (roomId, startTime, roomCapacity) => {
    try {
      const response = await api.post(`/api/reservations`, {
        roomId,
        startTime,
        endTime: startTime,
        reservationDate: selectedDate,
      });

      // 예약 완료 후 타임 슬롯 재조회
      await fetchAvailableTimeSlots(roomId);

      setError(null);
      alert(
        `회의실 ${response.data.name} 의 ${startTime}에 예약이 완료되었습니다.`,
      );
    } catch (err) {
      const message = err.response?.data?.message || "예약에 실패했습니다.";
      setError(message);
      if (message.includes("동시 예약")) {
        alert("동시에 예약할 수 없는 시간입니다.");
      }
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/rooms");
        setRooms(response.data);
      } catch (err) {
        setError("회의실 정보를 불러오기에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>회의실 예약 대시보드</h2>

      <div className="date-picker-section">
        <label htmlFor="reservation-date">예약 날짜 선택:</label>
        <input
          type="date"
          id="reservation-date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {error && <p className="error-message">{error}</p>}
      {loading && <p>회의실 정보를 불러오는 중입니다...</p>}

      <div className="room-list">
        {rooms.length === 0 ? (
          <p>회의실 정보를 불러올 수 없습니다.</p>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="room-card">
              <h3>{room.name}</h3>
              <p>최대 수용 인원: {room.capacity}명</p>
              <button onClick={() => fetchAvailableTimeSlots(room.id)}>
                예약 가능 시간 보기
              </button>
              {roomTimeSlots[room.id] && (
                <div className="time-slots">
                  {Object.entries(roomTimeSlots[room.id]).map(
                    ([startTime, available]) => (
                      <div
                        key={startTime}
                        className={`time-slot ${available ? "available" : "unavailable"}`}
                        style={{
                          cursor: available ? "pointer" : "not-allowed",
                          pointerEvents: available ? "auto" : "none",
                        }}
                        onClick={() =>
                          available &&
                          handleReservation(room.id, startTime, room.capacity)
                        }
                      >
                        <span>{startTime}</span>
                        {available && (
                          <button
                            type="button"
                            className="reservation-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReservation(
                                room.id,
                                startTime,
                                room.capacity,
                              );
                            }}
                          >
                            예약하기
                          </button>
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
