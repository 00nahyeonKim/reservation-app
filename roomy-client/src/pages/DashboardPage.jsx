import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "../components/reservation/DatePicker";
import TimeTimeline from "../components/reservation/TimeTimeline";
import axios from "../api/axiosInstance";
import { ReservationStatus } from "roomy";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchReservations();
  }, [date, navigate]);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const response = await axios.get("/api/reservations/my-reservations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const reservations = response.data;

      const usedSlots = new Set();
      reservations.forEach((reservation) => {
        if (reservation.status === ReservationStatus.RESERVED) {
          usedSlots.add(`${reservation.start_time}`);
        }
      });

      const endHour = 18;
      const timeline = [];

      for (let hour = 9; hour < endHour; hour++) {
        const hourStr = `${String(hour).padStart(2, "0")}:00`;
        if (!usedSlots.has(hourStr)) {
          timeline.push(hourStr);
        }
      }

      setAvailableSlots(timeline);
    } catch (err) {
      setError("예약 현황 조회 실패");
      console.error(err);
    }
  };

  const handleBookSlot = async (slot, startTime, endTime) => {
    const token = localStorage.getItem("authToken");
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) {
      navigate("/login");
      return;
    }

    setError("");

    setLoading(true);

    try {
      const response = await axios.post(
        "/api/reservations",
        {
          roomNo: slot,
          start_time: startTime,
          end_time: endTime,
          userId: userInfo.username,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert("예약 완료!");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "예약 실패";
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>예약 대시보드</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-wrapper">
        <DatePicker selectedDate={date} onChangeDate={setDate} />

        <div className="room-list">
          {availableSlots.map((slot, index) => (
            <div key={index} className="room-card">
              <span className="room-number">#{slot}</span>
              <button
                className="book-btn"
                onClick={() => handleBookSlot(slot, "09:00", "10:00")}
                disabled={loading}
              >
                {loading ? "예약 중..." : "예약"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
