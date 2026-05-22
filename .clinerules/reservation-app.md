# reservation-app directory

```text
reservation-app/
├── .gitignore
├── README.md                      # 프로젝트 소개 및 동시성 테스트 결과 기록 예정
├── PROJECT_DEVELOPMENT_PLAN.md    # 상세 개발 플랜 파일
├── PROJECT_README_PLAN.md         # 프로젝트 개요 파일
│
├── roomy/                         # [Day 1] Spring Boot 기반 백엔드 소스
│   ├── build.gradle               # Spring Boot 3.5.14 및 의존성 설정
│   ├── settings.gradle
│   └── src/
│       ├── main/
│       │   ├── java/com/roomy/
│       │   │   ├── RoomyApplication.java
│       │   │   │
│       │   │   ├── global/            # 전역 설정 및 공통 컴포넌트
│       │   │   │   ├── config/
│       │   │   │   │   ├── SecurityConfig.java  # 세션 기반 인증 및 CORS 설정
│       │   │   │   │   └── WebConfig.java
│       │   │   │   ├── exception/
│       │   │   │   │   ├── GlobalExceptionHandler.java # @RestControllerAdvice
│       │   │   │   │   ├── ErrorResponse.java          # 일관된 에러 응답 포맷
│       │   │   │   │   └── CustomException.java        # 비즈니스 커스텀 예외
│       │   │   │   └── common/
│       │   │   │       └── ReservationStatus.java   # RESERVED, CANCELED Enum
│       │   │   │
│       │   │   └── domain/            # 도메인 주도형 패키지 구조
│       │   │       ├── user/
│       │   │       │   ├── entity/User.java         # 6~13자 username ID 체계
│       │   │       │   ├── repository/UserRepository.java
│       │   │       │   ├── controller/AuthController.java
│       │   │       │   ├── service/AuthService.java # BCrypt 암호화 및 세션 로그인 구현
│       │   │       │   └── dto/
│       │   │       │       ├── SignupRequestDto.java  # 아이디 포맷 validation 포함
│       │   │       │       └── LoginRequestDto.java
│       │   │       │
│       │   │       ├── room/
│       │   │       │   ├── entity/MeetingRoom.java
│       │   │       │   ├── repository/MeetingRoomRepository.java
│       │   │       │   ├── controller/MeetingRoomController.java
│       │   │       │   └── service/MeetingRoomService.java # 슬롯 계산 알고리즘 포함
│       │   │       │
│       │   │       └── reservation/
│       │   │           ├── entity/Reservation.java          # (room_id, reservation_date, start_time) 복합 유니크 제약조건
│       │   │           ├── repository/ReservationRepository.java # 비관적 락 @Lock(LockModeType.PESSIMISTIC_WRITE)
│       │   │           ├── controller/ReservationController.java
│       │   │           ├── service/ReservationService.java       # Soft Delete (status 변경) 구현
│       │   │           └── dto/
│       │   │               ├── ReservationRequestDto.java   # Entity-DTO 분리
│       │   │               └── ReservationResponseDto.java
│       │   │
│       │   └── resources/
│       │       ├── application.yml        # Oracle DB 접속 및 Oracle Sequence ID 전략 명시
│       │       └── static/                # [Day 7] React 빌드 파일 통합 서빙용 (선택 사항)
│       │
│       └── test/java/com/roomy/
│           └── domain/reservation/
│               └── service/
│                   └── ReservationConcurrencyTest.java # [Day 5] ExecutorService, CountDownLatch 활용 100개 스레드 동시성 테스트
│
└── roomy-client/                  # [Day 2] React + Vite 기반 프론트엔드 소스
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/
        │   └── axiosInstance.js   # axios.defaults.withCredentials = true 설정
        ├── components/            # [Day 4] UI 컴포넌트
        │   ├── common/
        │   │   └── Toast.jsx      # 에러 팝업 및 알림 토스트
        │   ├── auth/
        │   │   ├── SignupForm.jsx
        │   │   └── LoginForm.jsx
        │   └── reservation/
        │       ├── RoomList.jsx
        │       ├── DatePicker.jsx   # 날짜 선택기
        │       └── TimeTimeline.jsx # 예약 불가능 시간 비활성화(Disabled) 타임라인 버튼
        └── pages/                 # 화면 단위 페이지 컴포넌트
            ├── LoginPage.jsx
            ├── SignupPage.jsx
            └── DashboardPage.jsx  # 예약 현황 및 타임라인 메인 대시보드
```

# 🗺️ Roomy Project Workspace Rules

## 0. The most important essential rule

Please read all of the .md files from D:\reservation-app\docs

## 1. ⚙️ Hardware & LLM Constraints (CRITICAL)

You are running on a local, lightweight LLM (Qwen 4B class) with limited VRAM (8GB). To prevent context overflow, hallucinations, and out-of-memory errors, you MUST adhere to these execution constraints:

- **Atomicity:** Do not attempt to write an entire service or multiple layers at once. Write ONE method, ONE DTO, or ONE component at a time.
- **Short Context:** Keep your explanations extremely brief. Focus on generating clean code rather than long conversational prose.
- **Incremental Verification:** After writing or modifying any code, stop immediately and ask the user to verify, compile, or run tests before moving to the next step.
- **No Snippets/Placeholders:** The LLM must NEVER use `// rest of code remains the same` or `// TODO`. Generated blocks must be complete, functional code units to prevent logic loss during Cline's apply phase.
- **Strict Chunking:** Maximize atomicity by keeping code blocks below 50 lines per response whenever possible.

---

## 2. 📅 Daily Development Roadmap & Scope

Follow the 7-day plan strictly. Do not implement future-day features ahead of time.

### 🟥 Day 1: Base Infrastructure & Entities (Oracle DB)

- **Tech:** Spring Boot 3.x, Spring Data JPA, Oracle DB
- **Rules:**
  - Map `User`, `MeetingRoom`, and `Reservation` entities.
  - **Table Naming (Oracle Reserved Keywords):** To avoid `ORA-00903`, never name tables exactly `USER` or `RESERVATION`. Always map entities explicitly using plural or prefixed names: `@Table(name = "USERS")`, `@Table(name = "RESERVATIONS")`.
  - Use Explicit Oracle Sequence for IDs: `@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "...")` with explicit sequence naming (e.g., `SEQ_USER_ID`, `SEQ_RESERVATION_ID`).
  - Implement Composite Unique Constraint on `Reservation` table level.

### 🟧 Day 2: Auth Infrastructure & Frontend Setup

- **Backend:** Spring Security server-side session management (`SessionCreationPolicy.ALWAYS` or `IF_REQUIRED`).
- **Explicit CORS Overrides:** When `allowCredentials(true)` is enabled, `allowedOrigins("*")` is strictly prohibited by Spring Security and will cause a runtime exception. Always declare exact URLs (e.g., `http://localhost:5173`).
- Validate `username` (6-13 chars) using `@Valid` and regex. Password encryption via `BCryptPasswordEncoder`.
- **Frontend:** Vite + React + Axios. Configure Axios global instance with `axios.defaults.withCredentials = true;`.

### 🟨 Day 3: Core Business Logic (Reservation & Cancel)

- **Rules:**
  - NEVER expose Entities directly to Controllers. Use `ReservationRequestDto` and `ReservationResponseDto`.
  - **Create:** Extract user ID from SessionContext. Validate duplicate start times in application level first.
  - **Cancel:** Validate if the requester owns the reservation. Implement **Soft Delete** by changing `status` to `CANCELED` (Do NOT use `DELETE` query).
  - **Soft Delete vs Unique Constraint:** Note that if a reservation is canceled via Soft Delete (`status = 'CANCELED'`), a strict composite unique constraint on `(room_id, reservation_date, start_time)` might block future bookings on that same slot. Ensure the application-level validation logic handles this properly.

### 🟩 Day 4: React UI & Time Slot Algorithm

- **Frontend:** Build Login/Signup forms and a Dashboard with a date picker (`input type="date"`).
- **Backend Slot Algorithm:** Use `java.time`. Generate a base timeline array (09:00 ~ 18:00, hourly). Query reservations for the date, filter by `RESERVED` status, and perform a relative complement (차집합) to return only available slots to the frontend.

### 🟦 Day 5: Pessimistic Lock & Concurrency Test

- **Rules:**
  - Apply `@Lock(LockModeType.PESSIMISTIC_WRITE)` on the repository query method to trigger Oracle's `SELECT ... FOR UPDATE`.
  - **Locking & Boundaries:** Every repository method annotated with `@Lock` MUST be invoked within an active `@Transactional` service boundary to guarantee proper acquisition and release of the database row lock.
  - Write a concurrency integration test using `ExecutorService` (100 multi-threads) and `CountDownLatch` to simulate simultaneous bookings.
  - Assert that exactly **1 request succeeds** and **99 requests fail**.

### 🟪 Day 6: Global Exception Handling

- **Backend:** Create `@RestControllerAdvice`. Explicitly catch `PessimisticLockingFailureException`, `DataIntegrityViolationException`, and custom business exceptions. Return a unified JSON error format: `{ "status": 400, "message": "..." }`.
- **Frontend:** Intercept errors in Axios `catch` blocks and display clean Toast/Alert messages to the user.

### ⬛ Day 7: Integration & Documentation

- Final refactoring (remove `System.out.println`, dummy data).
- Update `README.md` focusing on why Pessimistic Lock was used and document Day 5's 100-thread test log.

---

## 3. 🛠️ Technical Standards & Code Style

### Backend (Spring Boot / JPA)

- **Lombok:** Use `@Getter`, `@Setter`, `@NoArgsConstructor(access = AccessLevel.PROTECTED)` for entities. Avoid `@Data` on entities.
- **Validation:** Use `@NotNull`, `@Size`, `@Pattern` for incoming DTOs.
- **Time Representation:** Always use `LocalDate` for dates and `String` (HH:mm format) for start/end times as specified in the plan.

### Frontend (React)

- Functional components with standard hooks (`useState`, `useEffect`).
- Handle loading and error states explicitly for all asynchronous Axios requests.

---

## 4. 🤖 Cline Execution Protocol (How to proceed)

1. **Identify the Day:** Check which Day of the plan the user is currently working on.
2. **Read Before Write:** Read existing files fully before rewriting to prevent losing existing logic due to LLM context degradation.
3. **Propose and Confirm:** Propose the code change in small increments. Write the code, then explicitly state: _"Please compile/test this segment before we proceed."_
