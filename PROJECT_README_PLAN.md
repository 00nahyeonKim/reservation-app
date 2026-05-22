# 🏢 Roomy: 실무형 동시성 제어 회의실 예약 시스템

## 1. 프로젝트 개요

- **프로젝트명:** Roomy (실무형 동시성 제어 회의실 예약 시스템)
- **개발 기간:** 2026.05.21 ~ 2026.05.28
- **개발 인원:** 2명
- **핵심 목적:** 단순 CRUD 수준을 넘어, **데이터 무결성 보장**과 **동시성 이슈(락 제어)** 등 실무에서 발생하는 백엔드 고질적인 문제를 해결하고, React를 연동하여 실제 유저 시나리오에서 시스템이 안정적으로 작동하는지 증명하는 것을 목표로 합니다.

---

## 2. 기술 스택 및 선정 이유

| 분류           | 기술 스택                        | 선정 이유                                                                                                     |
| :------------- | :------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| **Backend**    | Spring Boot 3.x, Spring Security | 빠른 환경 구성 및 엔터프라이즈급 보안 표준(세션 관리) 적용                                                    |
| **Frontend**   | React, Axios                     | 컴포넌트 기반 UI 개발 및 비동기 API 통신을 통한 직관적인 예약 UX 제공                                         |
| **Data / ORM** | Spring Data JPA, Oracle DB       | 엔터프라이즈 환경에서 널리 쓰이는 Oracle 기반의 객체 지향적 도메인 모델링 및 비관적 락(Pessimistic Lock) 검증 |
| **VCS**        | Git / GitHub                     | 소스코드 버전 관리 및 기능별 브랜치 전략(Git Flow) 중심의 체계적 개발                                         |

---

## 3. 도메인 모델 및 DB 설계 (ERD 기준 데이터 구성)

### 3.1 `users` (회원 테이블)

- 이메일 형식의 복잡한 정규식 검증 대신, 실무 유저 ID 표준에 맞춰 **6~13자의 문자열 ID** 체계를 적용합니다.
- 동일한 로그인 ID로 중복 가입할 수 없도록 `username`에 `UNIQUE` 제약조건을 부여합니다.

| 컬럼명     | 타입          | 제약조건         | 설명                               |
| :--------- | :------------ | :--------------- | :--------------------------------- |
| `id`       | NUMBER(19)    | PK (Sequence)    | 고유 식별자 (Oracle Sequence 사용) |
| `username` | VARCHAR2(20)  | UNIQUE, NOT NULL | 로그인 아이디 (6~13자 문자열 제한) |
| `password` | VARCHAR2(255) | NOT NULL         | BCrypt 암호화된 비밀번호           |

### 3.2 `meeting_room` (회의실 테이블)

- 기본적인 회의실 메타데이터를 저장합니다.

| 컬럼명     | 타입          | 제약조건      | 설명                         |
| :--------- | :------------ | :------------ | :--------------------------- |
| `id`       | NUMBER(19)    | PK (Sequence) | 회의실 고유 번호             |
| `name`     | VARCHAR2(100) | NOT NULL      | 회의실 이름 (예: 1번 회의실) |
| `capacity` | NUMBER(5)     | NOT NULL      | 최대 수용 인원               |

### 3.3 `reservation` (예약 데이터 테이블)

- **무결성 보장:** 동시성 처리를 위해 데이터베이스 복합 유니크 제약조건 `(room_id, reservation_date, start_time)` 설정을 고려합니다.
- 데이터 soft-delete(실제 삭제 대신 상태 변경)를 위해 `status`를 `VARCHAR2` 형식의 문자열(Enum 매핑)로 관리합니다.

| 컬럼명             | 타입         | 제약조건                       | 설명                               |
| :----------------- | :----------- | :----------------------------- | :--------------------------------- |
| `id`               | NUMBER(19)   | PK (Sequence)                  | 예약 고유 번호                     |
| `user_id`          | NUMBER(19)   | FK (users.id), NOT NULL        | 예약자 고유 ID                     |
| `room_id`          | NUMBER(19)   | FK (meeting_room.id), NOT NULL | 예약된 회의실 ID                   |
| `reservation_date` | DATE         | NOT NULL                       | 예약 날짜                          |
| `start_time`       | VARCHAR2(5)  | NOT NULL                       | 예약 시작 시간 (HH:mm)             |
| `end_time`         | VARCHAR2(5)  | NOT NULL                       | 예약 종료 시간 (HH:mm)             |
| `status`           | VARCHAR2(20) | NOT NULL                       | 예약 상태 (`RESERVED`, `CANCELED`) |

---

## 4. 핵심 API 명세 (End-points)

### 🔐 인증 API (Session 기반)

- `POST /api/auth/signup` : 회원 가입 (`username`, `password` 필요, Validation 검증 필수)
- `POST /api/auth/login` : 로그인 (성공 시 서버 세션 생성 및 브라우저 Cookie에 `JSESSIONID` 발급)
- `POST /api/auth/logout` : 로그아웃 (세션 만료 처리)

### 🏢 회의실 및 예약 API (인증 필요 API는 세션 체크 진행)

- `GET /api/rooms` : 전체 회의실 목록 및 수용 인원 조회
- `GET /api/rooms/{roomId}/available-slots?date=2026-05-25` : 특정 회의실의 날짜별 예약 가능한 시간대 목록 반환
- `POST /api/reservations` : 예약 생성 (로그인 세션 필요)
- `PATCH /api/reservations/{id}/cancel` : 예약 취소 (본인 확인 후 `status`를 `CANCELED`로 변경)

---

## 5. 핵심 기술적 도전 과제 & 해결 전략 (면접 프리패스 포인트)

### 💥 Challenge 1: 동시성 이슈 (Double Booking 문제)

- **상황:** 인기 있는 1번 회의실의 동일한 타임에 두 사용자가 정확히 동시에 `POST /api/reservations`를 요청할 때, 애플리케이션의 중복 검증을 둘 다 통과하여 중복 예약이 발생하는 현상.
- **해결 전략:**
  1. **Oracle 복합 Unique 제약조건:** DB 단에 `(room_id, reservation_date, start_time)` 결합 인덱스 및 유니크 제약조건을 설정하여 최후의 순간까지 데이터 무결성을 1차 방어합니다.
  2. **비관적 락 (Pessimistic Lock):** JPA에서 `@Lock(LockModeType.PESSIMISTIC_WRITE)`를 사용하여 Oracle 데이터 조회 시 `SELECT ... FOR UPDATE` 쿼리를 발생시킵니다. 트랜잭션이 끝날 때까지 다른 트랜잭션이 해당 행에 접근하지 못하도록 제어하여 완벽한 줄 세우기를 구현합니다.

### 🔐 Challenge 2: 세션(Session) 기반 인증과 CORS/크레덴셜 관리

- **상황:** JWT와 달리 세션 방식은 서버 메모리(또는 세션 스토어)에서 상태를 관리하므로, React(클라이언트)와 Spring Boot(서버) 간의 크로스 도메인 요청 시 쿠키(`JSESSIONID`)가 누락되어 인증이 풀리는 문제가 발생할 수 있음.
- **해결 전략:** Spring Security 설정에서 `cors()` 및 `withDefaults()`를 정교하게 세팅하고, React의 Axios 인스턴스에 `withCredentials: true` 옵션을 기본값으로 설정합니다. 이를 통해 브라우저가 세션 쿠키를 안전하게 주고받을 수 있도록 인프라 및 통신 환경을 구축합니다.

### ⏱ Challenge 3: 시간 유효성 및 슬롯 계산 로직

- **상황:** 이미 예약된 시간대를 제외한 나머지 '예약 가능한 시간'을 React 화면에 실시간으로 뿌려주기 위한 알고리즘 필요.
- **해결 전략:** Java 8 `java.time` 패키지를 활용하고, 해당 날짜의 전체 운영 시간 배열에서 Oracle DB에 존재하는 `RESERVED` 상태의 예약 시간대를 차집합으로 제외하는 비즈니스 로직을 Service 레이어에 구현하여 정제된 데이터만 프론트엔드로 반환합니다.

---

## 6. 일주일 데일리 타임라인 (Day 1 ~ Day 7)

- **Day 1 — 백엔드 환경 세팅 및 Git 저장소 구성**
  - Spring Boot 기본 세팅 및 Oracle DB 로컬 연동
  - JPA 엔티티 기본 매핑 (Oracle Sequence 전략 적용), Git Repository 초기화 및 브랜치 전략 수립
- **Day 2 — 회원 기능 (Security & Session) 및 프론트 기본 세팅**
  - Spring Security 기반 Form Login / Custom 세션 관리 메커니즘 구현
  - 6~13자 ID 정규식 및 비밀번호 암호화(`BCrypt`) 검증 로직 구현
  - React 프로젝트 초기 생성(`Vite` 또는 `CRA`) 및 Axios 통신 세팅
- **Day 3 — 회의실 + 예약 CRUD 백엔드 구현**
  - 회의실 조회, 예약 생성, 예약 취소의 기본 비즈니스 로직 및 뼈대 코드 구현
  - Entity-DTO 간의 분리 및 Soft Delete 구현 (`RESERVED` / `CANCELED`)
- **Day 4 — React 프론트엔드 UI 화면 구현**
  - React를 활용한 로그인/회원가입 폼 화면 제작 (세션 연동 테스트)
  - 회의실 목록 보기 및 날짜 선택 시 예약 가능 슬롯 타임라인을 보여주는 컴포넌트 구현
- **Day 5 — 동시성 처리 및 통합 테스트**
  - `@Transactional` 격리 수준 검토 및 `@Lock(LockModeType.PESSIMISTIC_WRITE)` 적용
  - `CountDownLatch`와 `ExecutorService`를 활용하여 **100개의 스레드가 동시에 예약을 시도하는 백엔드 통합 테스트 코드** 작성 및 검증
- **Day 6 — 글로벌 예외 처리 및 API 연결 안정화**
  - `@RestControllerAdvice`를 이용한 전역 예외 처리(Global Exception Handler) 구축
  - React 화면에서 중복 예약 시 발생하는 예외(락 타임아웃, Unique 제약조건 위배 등)를 캐치하여 사용자에게 "이미 예약된 시간입니다" 등의 알림을 주는 프론트-백 핸들링 최적화
- **Day 7 — 최종 리팩토링 및 마무리**
  - 개발된 React 빌드 및 Spring Boot 통합 구동 확인
  - 최종 코드 리팩토링, 불필요한 로그 제거 및 GitHub `README.md` 작성 완료
