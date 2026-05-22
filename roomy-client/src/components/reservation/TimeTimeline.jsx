import React, { useState } from "react";
import axios from "../../api/axiosInstance";

const TimeTimeline = ({
  selectedDate,
  onTimeSelect,
  selectedStartTime,
  setStartTime,
}) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startHour = 9;
  const endHour = 18;
  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i,
  );

  const getTimeSlots = async () => {
    if (!selectedDate) {
      setError("날짜를 선택해주세요.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.get("/api/reservation/getTimeSlots", {
        params: { date: selectedDate },
      });
      setAvailableSlots(response.data);
    } catch (err) {
      setError(err.message || "시간대 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleTimeClick = (startTime, endTime) => {
    if (startTime === selectedStartTime) {
      setStartTime("");
    } else {
      setStartTime(startTime);
    }
    onTimeSelect(startTime, endTime);
  };

  return (
    <div className="time-timeline">
      <div className="time-timeline-header">
        <h3>예약 가능한 시간대</h3>
        <button onClick={getTimeSlots} disabled={loading}>
          {loading ? "로딩 중..." : "시간대 확인"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="timeline-container">
        {hours.map((hour) => (
          <div key={hour} className="time-slot">
            <div className="time-label">
              {hour.toString().padStart(2, "0")}시~
              {(hour + 1).toString().padStart(2, "0")}시
            </div>
            <div className="time-options">
              {availableSlots
                .filter((slot) => slot.startTime === String(hour))
                .map((slot) => (
                  <button
                    key={slot.id}
                    className={
                      slot.status === "RESERVED"
                        ? "time-option reserved"
                        : slot.status === "CANCELED"
                          ? "time-option canceled"
                          : "time-option available"
                    }
                    onClick={() =>
                      handleTimeClick(slot.startTime, slot.endTime)
                    }
                    disabled={
                      slot.status === "RESERVED" || slot.status === "CANCELED"
                    }
                  >
                    {slot.status === "RESERVED"
                      ? "예약됨"
                      : slot.status === "CANCELED"
                        ? "취소됨"
                        : "가능"}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeTimeline;
