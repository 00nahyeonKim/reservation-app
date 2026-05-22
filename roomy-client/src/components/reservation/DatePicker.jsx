import React from "react";

const DatePicker = ({ selectedDate, onSelectDate }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [displayDate, setDisplayDate] = React.useState(new Date());
  const [error, setError] = React.useState(null);

  const goToPrevMonth = () => {
    setCurrentDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setDisplayDate(new Date());
  };

  const goToSelectedDate = () => {
    setCurrentDate(selectedDate);
    setDisplayDate(new Date(selectedDate));
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDay = (day) => {
    return day.toString().padStart(2, '0');
  };

  const formatDate = (year, month, day) => {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = formatDay(day);
    return `${year}-${monthStr}-${dayStr}`;
  };

  const handleDateClick = (day) => {
    try {
      const year = displayDate.getFullYear();
      const month = displayDate.getMonth();
      const date = formatDate(year, month, day);
      if (!date) return;
      
      if (!selectedDate || selectedDate !== date) {
        onSelectDate(date);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthDisplay = String(month + 1).padStart(2, '0');

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  const totalDays = 35;

  const days = Array.from({ length: totalDays }, (_, i) => {
    const day = firstDayOfMonth + i;
    return day <= daysInMonth ? day : 0;
  });

  const formattedSelectedDate = selectedDate ? formatDate(year, month, selectedDate.getDate()) : null;
  const formattedToday = formatDate(year, month, new Date().getDate());

  return (
    <div className="date-picker">
      <div className="date-picker-header">
        <button onClick={goToPrevMonth} aria-label="이전 달"><</button>
        <span className="month-year">{year.toString().slice(2)}년 {monthDisplay} 월</span>
        <button onClick={goToNextMonth} aria-label="다음 달">></button>
      </div>

      <div className="date-picker-today-btn" onClick={goToToday}>
        📅 오늘
      </div>

      <div className="date-picker-selected" onClick={goToSelectedDate}>
        {formattedSelectedDate || "선택된 날짜 없음"}
      </div>

      <div className="calendar-body">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="day-name">{day}</div>
        ))}

        {Array.from({ length: firstDayOfMonth }, () => (
          <div className="day-day" key="empty"></div>
        ))}

        {days.map((day, index) => (
          <button
            key={index}
            className={day === 0 ? "day-day disabled" : "day-day"}
            onClick={() => day !== 0 && handleDateClick(day)}
            disabled={day === 0}
          >
            {day !== 0 ? formatDay(day) : ""}
          </button>
        ))}
      </div>

      {error && (
        <div className="date-picker-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default DatePicker;