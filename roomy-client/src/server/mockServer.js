import express from "express";
import {
  mockUsers,
  mockRooms,
  mockReservations,
  mockRoomSlots,
  mockAllRooms,
  mockAllRoomsAllTime,
} from "./mockData.js";
import { randomUUID } from "crypto";

// Mock Express 서버
const app = express();
const PORT = process.env.PORT || 5174;

// Mock users
app.get("/api/users", (req, res) => {
  res.json(mockUsers);
});

app.post("/api/users", (req, res) => {
  const newUser = {
    id: randomUUID().substring(0, 8).toUpperCase(),
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  };
  res.status(201).json({ id: newUser.id, ...newUser });
});

// Mock login (BCrypt 암호화)
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = mockUsers.find((u) => u.username === username);

    if (!user) {
      return res
        .status(401)
        .json({ message: "아이디 또는 비밀번호가 잘못되었습니다." });
    }

    // Simple password check (BCrypt 구현 필요)
    if (password === user.password) {
      res.json({ username, token: "mock-jwt-token-" + randomUUID() });
    } else {
      res
        .status(401)
        .json({ message: "아이디 또는 비밀번호가 잘못되었습니다." });
    }
  } catch (error) {
    res.status(500).json({ message: "로그인 실패" });
  }
});

// Mock rooms
app.get("/api/rooms", (req, res) => {
  res.json(mockRooms);
});

// Mock reservations
app.get("/api/reservations", (req, res) => {
  res.json(mockReservations);
});

// Mock date (2025-06-01)
const mockDate = "2025-06-01";
app.get(`/api/reservations/date/${mockDate}`, (req, res) => {
  res.json(mockReservations.filter((r) => r.reservationDate === mockDate));
});

// Mock available slots
app.get(`/api/rooms/slots/${mockDate}`, (req, res) => {
  const roomId = req.query.roomId;
  const roomSlotData = mockRoomSlots.find((r) => r.roomId === roomId);

  if (!roomSlotData) {
    return res.status(404).json({ error: "존재하지 않는 회의실 ID" });
  }

  res.json(roomSlotData.slots);
});

// Mock all rooms with available slots
app.get(`/api/rooms/available/all-time`, (req, res) => {
  res.json(mockAllRoomsAllTime);
});

// Mock room info with available slots (날짜별)
app.get(`/api/rooms/available/:date`, (req, res) => {
  const date = req.params.date;
  if (date !== mockDate) {
    return res.status(400).json({ error: "잘못된 날짜" });
  }

  const availableSlots = [
    {
      roomId: "1",
      availableSlots: [
        ["09", "10"],
        ["11", "12"],
        ["13", "14"],
        ["15", "16"],
        ["16", "17"],
        ["17", "18"],
      ],
    },
    {
      roomId: "2",
      availableSlots: [
        ["09", "10"],
        ["11", "12"],
        ["13", "14"],
        ["15", "16"],
        ["16", "17"],
        ["17", "18"],
      ],
    },
    {
      roomId: "3",
      availableSlots: [
        ["09", "10"],
        ["11", "12"],
        ["13", "14"],
        ["15", "16"],
        ["16", "17"],
        ["17", "18"],
      ],
    },
  ];

  res.json(availableSlots);
});

// Mock create reservation
app.post("/api/reservations", (req, res) => {
  const { roomId, userId, reservationDate, startTime, endTime } = req.body;

  // 이미 예약된 시간이 있는지 확인
  const duplicate = mockReservations.some(
    (r) =>
      r.reservationDate === reservationDate &&
      r.startTime === startTime &&
      r.roomId === roomId,
  );

  if (duplicate) {
    return res.status(400).json({ message: "이미 예약된 시간입니다." });
  }

  const newReservation = {
    id: randomUUID().substring(0, 8).toUpperCase(),
    roomId,
    userId,
    reservationDate,
    startTime,
    endTime,
    status: "RESERVED",
  };

  res.status(201).json(newReservation);
});

// Mock cancel reservation
app.delete("/api/reservations/:id", (req, res) => {
  const id = req.params.id;

  // Find the reservation
  const reservationIndex = mockReservations.findIndex((r) => r.id === id);
  if (reservationIndex === -1) {
    return res.status(404).json({ message: "예약이 존재하지 않습니다." });
  }

  // Update status to CANCELED
  mockReservations[reservationIndex].status = "CANCELED";

  res.json(mockReservations[reservationIndex]);
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock API 서버 시작: http://localhost:${PORT}`);
});

export default app;
