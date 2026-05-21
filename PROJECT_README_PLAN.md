# 🏢 Roomy: 실무형 동시성 제어 회의실 예약 시스템

## 1. 프로젝트 개요
* **프로젝트명:** Roomy (실무형 동시성 제어 회의실 예약 시스템)
* **개발 기간:** 2026.05.21 ~ 2026.05.28 (7일 단기 집중 프로젝트)
* **개발 인원:** 백엔드 1인 (포트폴리오용 원맨 프로젝트)
* **핵심 목적:** 단순 CRUD 수준을 넘어, **데이터 무결성 보장**과 **동시성 이슈(락 제어)** 등 실무에서 발생하는 백엔드 고질적인 문제를 해결하고 이를 증명하는 것을 목표로 합니다.

---

## 2. 기술 스택 및 선정 이유

| 분류 | 기술 스택 | 선정 이유 |
| :--- | :--- | :--- |
| **Framework** | Spring Boot 3.x, Spring Security | 빠른 환경 구성 및 엔터프라이즈급 보안 표준(JWT) 적용 |
| **Data / ORM** | Spring Data JPA, MySQL 8.0 | 객체 지향적 도메인 모델링 및 데이터 영속성 확보, 비관적 락(Pessimistic Lock) 지원 |
| **Infrastructure** | Docker, Docker Compose | MySQL 등 외부 의존성 환경을 독립시키고 이식성 높은 개발 환경 구축 |
| **Documentation** | Swagger UI (Springdoc-openapi) | 프론트엔드가 없어도 API 테스트 및 시각적 명세서 자동화 가능 |

---

## 3. 도메인 모델 및 DB 설계 (ERD 기준 데이터 구성)

### 3.1 `users` (회원 테이블)
* 동일한 이메일로 중복 가입할 수 없도록 `email`에 `UNIQUE` 제약조건을 부여합니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, Auto Increment | 고유 식별자 |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | 로그인 아이디로 사용될 이메일 |
| `password` | VARCHAR(255) | NOT NULL | BCrypt 암호화된 비밀번호 |

### 3.2 `meeting_room` (회의실 테이블)
* 기본적인 회의실 메타데이터를 저장합니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, Auto Increment | 회의실 고유 번호 |
| `name` | VARCHAR(100) | NOT NULL | 회의실 이름 (예: 1번 회의실) |
| `capacity` | INT | NOT NULL | 최대 수용 인원 |

### 3.3 `reservation` (예약 데이터 테이블)
* **무결성 보장:** 동시성 처리를 위해 데이터베이스 복합 유니크 제약조건 `(room_id, reservation_date, start_time)` 설정을 고려합니다.
* 데이터 soft-delete(실제 삭제 대신 상태 변경)를 위해 `status`를 `enum`으로 관리합니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, Auto Increment | 예약 고유 번호 |
| `user_id` | BIGINT | FK (users.id), NOT NULL | 예약자 고유 ID |
| `room_id` | BIGINT | FK (meeting_room.id), NOT NULL | 예약된 회의실 ID |
| `reservation_date` | DATE | NOT NULL | 예약 날짜 (YYYY-MM-DD) |
| `start_time` | TIME | NOT NULL | 예약 시작 시간 (HH:mm) |
| `end_time` | TIME | NOT NULL | 예약 종료 시간 (HH:mm) |
| `status` | VARCHAR(20) | NOT NULL | 예약 상태 (`RESERVED`, `CANCELED`) |

---

## 4. 핵심 API 명세 (End-points)

### 🔐 인증 API
* `POST /api/auth/signup` : 회원 가입 (`email`, `password` 필요)
* `POST /api/auth/login` : 로그인 (성공 시 응답 헤더 혹은 바디로 JWT 토큰 반환)

### 🏢 회의실 및 예약 API
* `GET /api/rooms` : 전체 회의실 목록 및 수용 인원 조회
* `GET /api/rooms/{roomId}/available-slots?date=2026-05-25` : 특정 회의실의 날짜별 예약 가능한 시간대 목록 반환
* `POST /api/reservations` : 예약 생성 (JWT 토큰 인증 필요)
* `PATCH /api/reservations/{id}/cancel` : 예약 취소 (본인 확인 후 `status`를 `CANCELED`로 변경)

---

## 5. 핵심 기술적 도전 과제 & 해결 전략 (면접 프리패스 포인트)

### 💥 Challenge 1: 동시성 이슈 (Double Booking 문제)
* **상황:** 인기 있는 1번 회의실의 14:00~15:00 타임에 두 사용자가 정확히 동시에 `POST /api/reservations`를 요청할 때, 애플리케이션의 `exists()` 검증을 둘 다 통과하여 두 개의 예약 데이터가 모두 저장되는 현상.
* **해결 전략:** 1. **DB 레벨 Unique 제약조건:** `(room_id, reservation_date, start_time)` 복합 유니크 키 설정을 통해 완벽한 무결성을 1차 방어합니다. (JPA 변환 과정에서 `DataIntegrityViolationException` 발생 예외 처리 필요)
  2. **비관적 락 (Pessimistic Lock):** JPA에서 `@Lock(LockModeType.PESSIMISTIC_WRITE)`를 사용하여 데이터 조회 시점부터 다른 트랜잭션이 접근하지 못하도록 줄을 세웁니다.

### ⏱ Challenge 2: 시간 유효성 및 슬롯 계산 로직
* **상황:** 1시간 단위로만 예약이 가능하다고 가정할 때, 이미 예약된 시간대를 제외한 나머지 '예약 가능한 시간'을 계산하는 알고리즘 필요.
* **해결 전략:** Java 8 `java.time` 패키지(`LocalDate`, `LocalTime`)를 적극 활용하고, 해당 날짜의 전체 운영 시간(예: 09:00 ~ 18:00) 배열에서 DB에 존재하는 `RESERVED` 상태의 예약 시간대를 차집합으로 제외하는 비즈니스 로직을 온전히 Service 레이어에 구현합니다.

### 🔄 Challenge 3: Soft Delete (상태 관리)
* **상황:** 예약을 취소할 때 `DELETE` 쿼리로 날려버리면 과거 예약 이력 데이터가 사라져 통계나 추적 조회가 불가능함.
* **해결 전략:** `ReservationStatus`를 이용해 `RESERVED` -> `CANCELED`로 상태만 업데이트합니다. 예약 생성 로직에서 중복 검사를 할 때도 `status = 'RESERVED'`인 데이터만 검사 대상에 포함하도록 쿼리를 정교화합니다.

---

## 6. 일주일 데일리 타임라인 (Day 1 ~ Day 7)

* **Day 1 — 프로젝트 세팅**
  * Spring Boot 기본 세팅, Docker Compose 기반 MySQL 연동
  * JPA 엔티티 기본 매핑 및 Swagger UI 적용, GitHub 초기 레포지토리 세팅
* **Day 2 — 회원 기능 (Security & JWT)**
  * Spring Security 기반 Filter 구현, JWT 토큰 발급 및 파싱 로직 구현
  * PasswordEncoder(BCrypt)를 통한 비밀번호 암호화 저장 및 로그인 검증 완료
* **Day 3 — 회의실 + 예약 CRUD**
  * 회의실 조회, 예약 생성, 예약 취소의 기본 비즈니스 로직 및 뼈대 코드 구현
  * Entity-DTO 간의 완벽한 분리 및 연관 관계 매핑
* **Day 4 — 예약 검증 로직 고도화**
  * `java.time` 패키지를 활용한 예약 시간 중복 체크 비즈니스 로직 구현
  * 특정 날짜의 예약 가능 슬롯 계산 알고리즘 최적화 및 단위 테스트 작성
* **Day 5 — 트랜잭션 분리 및 동시성 처리**
  * `@Transactional` 격리 수준 검토 및 `@Lock(LockModeType.PESSIMISTIC_WRITE)` 적용
  * `CountDownLatch`와 `ExecutorService`를 활용하여 **100개의 스레드가 동시에 동시 예약을 시도하는 통합 테스트 코드** 작성 및 검증
* **Day 6 — 글로벌 예외 처리 및 문서화**
  * `@RestControllerAdvice`를 이용한 전역 예외 처리(Global Exception Handler) 구축
  * `@Valid`를 이용한 요청 값 검증 및 Swagger API 명세 고도화
* **Day 7 — 최종 리팩토링 및 마무리**
  * Docker 환경에서의 전체 애플리케이션 빌드 및 실행 테스트
  * 최종 코드 리팩토링 및 GitHub `README.md` 작성 완료