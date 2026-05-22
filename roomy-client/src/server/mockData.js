// Mock 데이터 생성 함수

// Mock Users 데이터
const mockUsers = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    email: "admin@example.com",
  },
  {
    id: "2",
    username: "user1",
    password: "password123",
    email: "user1@example.com",
  },
];

// Mock Meeting Rooms 데이터
const mockRooms = [
  {
    id: "1",
    name: "회의실 A",
    capacity: 4,
    description: "작기しい 회의실",
    status: "AVAILABLE",
  },
  {
    id: "2",
    name: "회의실 B",
    capacity: 6,
    description: "중간 규모 회의실",
    status: "AVAILABLE",
  },
  {
    id: "3",
    name: "대회의실",
    capacity: 12,
    description: "크기 큰 회의실",
    status: "AVAILABLE",
  },
];

// Mock Reservations 데이터
const mockReservations = [
  {
    id: "1",
    roomId: "1",
    userId: "1",
    reservationDate: "2025-06-01",
    startTime: "10:00",
    endTime: "11:00",
    status: "RESERVED",
  },
  {
    id: "2",
    roomId: "1",
    userId: "2",
    reservationDate: "2025-06-01",
    startTime: "14:00",
    endTime: "15:00",
    status: "RESERVED",
  },
];

// Mock Rooms for slot calculation (문자열로 시간값 저장)
const mockRoomSlots = [
  {
    roomId: "1",
    slots: [
      ["10", "11"],
      ["14", "15"],
    ],
  }, // 2025-06-01 기준
  {
    roomId: "2",
    slots: [
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
    slots: [
      ["09", "10"],
      ["12", "13"],
      ["14", "15"],
      ["16", "17"],
    ],
  },
];

// Mock Rooms for availability check (all rooms)
const mockAllRooms = [
  { id: "1", name: "회의실 A", capacity: 4 },
  { id: "2", name: "회의실 B", capacity: 6 },
  { id: "3", name: "대회의실", capacity: 12 },
];

// Mock Rooms for all times (09:00 ~ 18:00) - 문자열로 시간값 저장
const mockAllRoomsAllTime = [
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

export {
  mockUsers,
  mockRooms,
  mockReservations,
  mockRoomSlots,
  mockAllRooms,
  mockAllRoomsAllTime,
};
