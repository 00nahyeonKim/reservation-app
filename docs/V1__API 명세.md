# 회의실 예약 앱 — API 명세

## Base URL
```
http://localhost:8080
```

---

## 사용자 (Users)

| Method | URL | 설명 | 로그인 필요 |
|--------|-----|------|------------|
| POST | /api/users/signup | 회원가입 | X |
| POST | /api/users/login | 로그인 | X |
| POST | /api/users/logout | 로그아웃 | X |
| GET | /api/users/me | 내 정보 조회 | O |

### POST /api/users/signup
**Request**
```json
{
  "username": "testuser",
  "password": "1234"
}
```
**Response** `201 Created`
```json
{
  "id": 1,
  "username": "testuser"
}
```

---

### POST /api/users/login
**Request**
```json
{
  "username": "testuser",
  "password": "1234"
}
```
**Response** `200 OK`
```json
{
  "id": 1,
  "username": "testuser"
}
```
> 로그인 성공 시 서버에서 `JSESSIONID` 세션 쿠키 발급. 이후 인증 필요 API는 이 쿠키로 인증.

---

### POST /api/users/logout
**Request Body** 없음

**Response** `200 OK`

---

### GET /api/users/me
**Request Body** 없음

**Response** `200 OK`
```json
{
  "id": 1,
  "username": "testuser"
}
```

---

## 회의실 (Rooms)

| Method | URL | 설명 | 로그인 필요 |
|--------|-----|------|------------|
| POST | /api/rooms | 회의실 등록 | X |
| GET | /api/rooms | 전체 회의실 목록 조회 | X |
| GET | /api/rooms/{id} | 회의실 단건 조회 | X |

### POST /api/rooms
**Request**
```json
{
  "name": "1번 회의실",
  "capacity": 10
}
```
**Response** `201 Created`
```json
{
  "id": 1,
  "name": "1번 회의실",
  "capacity": 10
}
```

---

### GET /api/rooms
**Request Body** 없음

**Response** `200 OK`
```json
[
  { "id": 1, "name": "1번 회의실", "capacity": 10 },
  { "id": 2, "name": "2번 회의실", "capacity": 6 }
]
```

---

### GET /api/rooms/{id}
**Path Variable**: `id` — 회의실 ID

**Response** `200 OK`
```json
{
  "id": 1,
  "name": "1번 회의실",
  "capacity": 10
}
```

---

## 예약 (Reservations)

| Method | URL | 설명 | 로그인 필요 |
|--------|-----|------|------------|
| POST | /api/reservations | 예약 생성 | O |
| GET | /api/reservations/my | 내 예약 목록 조회 | O |
| DELETE | /api/reservations/{id} | 예약 취소 | O |
| GET | /api/reservations?roomId=&date= | 날짜별 예약 조회 | X |

### POST /api/reservations
**Request**
```json
{
  "roomId": 1,
  "reservationDate": "2025-06-01",
  "startTime": "09:00",
  "endTime": "10:00"
}
```
> `reservationDate` 형식: `yyyy-MM-dd`
> `startTime`, `endTime` 형식: `HH:mm`

**Response** `201 Created`
```json
{
  "id": 1,
  "username": "testuser",
  "roomName": "1번 회의실",
  "reservationDate": "2025-06-01",
  "startTime": "09:00",
  "endTime": "10:00",
  "status": "RESERVED"
}
```

---

### GET /api/reservations/my
**Request Body** 없음

**Response** `200 OK`
```json
[
  {
    "id": 1,
    "username": "testuser",
    "roomName": "1번 회의실",
    "reservationDate": "2025-06-01",
    "startTime": "09:00",
    "endTime": "10:00",
    "status": "RESERVED"
  }
]
```

---

### DELETE /api/reservations/{id}
**Path Variable**: `id` — 예약 ID
> 본인 예약만 취소 가능. 타인 예약 시도 시 `403`.

**Response** `200 OK`

---

### GET /api/reservations?roomId=&date=
**Query Parameter**
- `roomId` (필수): 회의실 ID
- `date` (필수): 조회 날짜 (`yyyy-MM-dd` 형식)

**예시**
```
GET /api/reservations?roomId=1&date=2025-06-01
```

**Response** `200 OK`
```json
[
  {
    "id": 1,
    "username": "testuser",
    "roomName": "1번 회의실",
    "reservationDate": "2025-06-01",
    "startTime": "09:00",
    "endTime": "10:00",
    "status": "RESERVED"
  }
]
```

---

## 에러 응답 공통 형식

```json
{
  "status": 401,
  "message": "로그인이 필요합니다."
}
```

| 상태코드 | 설명 |
|----------|------|
| 400 | 요청 값 검증 실패 |
| 401 | 로그인 필요 또는 비밀번호 오류 |
| 403 | 권한 없음 (타인 예약 취소 시도 등) |
| 404 | 리소스 없음 (사용자, 회의실, 예약) |
| 409 | 중복 (아이디 중복, 예약 중복) |
