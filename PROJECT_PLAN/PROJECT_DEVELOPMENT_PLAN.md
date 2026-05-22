# 🗺️ Roomy: 실무형 동시성 제어 회의실 예약 시스템 - 상세 개발 플랜

본 문서는 `PROJECT_README_PLAN_v2.md`를 기반으로, 7일간의 짧은 기간 동안 설계 오류나 구현 시행착오를 최소화하고 백엔드와 프론트엔드의 싱크를 완벽히 맞추기 위해 작성된 구체적 개발 지침서입니다.

---

## 📅 일단위 상세 개발 프로세스

### 🟥 Day 1: 백엔드 베이스 인프라 구축 및 엔티티 매핑

- **목표:** Spring Boot와 Oracle DB를 연동하고, 데이터 무결성을 고려한 핵심 도메인 모델을 구축한다.
- **상세 행동 지침:**
  1. **프로젝트 초기화:** Spring Boot 3.x, Spring Data JPA, Oracle Driver, Lombok, Validation 의존성을 설정합니다.
  2. **Oracle DB 연동:** `application.yml`에 DB 접속 정보를 설정하고, 엔티티 ID 생성 전략으로 Oracle Sequence를 명시적으로 매핑합니다.
  3. **엔티티(Entity) 구현:**
     - `User`: `username`(6~13자), `password` 필드 구성. `username`에 `@Column(unique = true)` 설정.
     - `MeetingRoom`: `name`, `capacity` 필드 구성.
     - `Reservation`: `reservationDate`(`LocalDate`), `startTime`·`endTime`(`String`, HH:mm 포맷), `status`(`ReservationStatus` Enum) 구성.
  4. **물리 제약조건 선언:** `Reservation` 엔티티 상단에 `@Table(uniqueConstraints = ...)`를 활용해 데이터베이스 단에 `(room_id, reservation_date, start_time)` 복합 유니크 제약조건을 설정합니다.
- **Day 1 체크리스트:**
  - [ ] 로컬/원격 Oracle DB와 Spring Boot가 에러 없이 커넥션을 맺는가?
  - [ ] JPA를 통해 테이블 생성 시, 복합 Unique 제약조건과 Sequence가 정상 반영되는가?

---

### 🟧 Day 2: 인증 인프라(Security + Session) 및 프론트엔드 기초 공사

- **목표:** 세션 기반 인증 환경을 완성하고, React와의 크로스 도메인 쿠키 공유 환경을 세팅한다.
- **상세 행동 지침:**
  1. **Spring Security 설정:**
     - Session Creation Policy를 `ALWAYS` 또는 `IF_REQUIRED`로 설정하여 서버 세션 기반으로 상태를 관리합니다.
     - CORS 설정을 명시적으로 구현합니다 (`allowedOrigins`에 React 주소 명시, `allowCredentials(true)` 필수).
  2. **회원가입/로그인 비즈니스 로직:**
     - `@Valid` 및 정규식을 활용해 6~13자 아이디 포맷 검증 로직을 구현합니다.
     - `BCryptPasswordEncoder`를 통해 비밀번호를 암호화하여 저장하고 로그인 인증 알고리즘을 완성합니다.
  3. **React(Vite) 프로젝트 세팅:**
     - Vite 기반 React 프론트엔드 환경을 구성하고 Axios를 설치합니다.
     - Axios 전역 인스턴스 설정에 `axios.defaults.withCredentials = true;`를 명시하여, 요청 시 세션 쿠키(`JSESSIONID`)가 브라우저와 서버 간에 안전하게 주고받아지도록 처리합니다.
- **Day 2 체크리스트:**
  - [ ] 회원가입 시 유효성 검증(6~13자 미만/초과 등) 시 정상적으로 400 Bad Request가 발생하는가?
  - [ ] 로그인 성공 시 응답 헤더에 `Set-Cookie: JSESSIONID=...`가 포함되는가?

---

### 🟨 Day 3: 핵심 비즈니스 로직(예약 & 취소) 백엔드 구현

- **목표:** 기본적인 예약 생성, 취소 기능 및 상태 변경(Soft Delete) 로직을 완성한다.
- **상세 행동 지침:**
  1. **DTO 설계 및 분리:** 레이어 간 데이터 독립성을 위해 `ReservationRequestDto`와 `ReservationResponseDto`를 생성하고, 엔티티가 컨트롤러 단에 직접 노출되지 않도록 제어합니다.
  2. **예약 생성 로직 (`POST /api/reservations`):**
     - 세션Context에서 현재 로그인한 유저 ID를 추출합니다.
     - 동일 날짜, 동일 회의실에 중복된 시작 시간이 있는지 1차 애플리케이션 검증 후 `RESERVED` 상태로 저장합니다.
  3. **예약 취소 로직 (`PATCH /api/reservations/{id}/cancel`):**
     - 예약 ID로 데이터를 조회한 후, 요청자가 본인이 맞는지 검증 로직을 수행합니다.
     - 물리적 삭제(`DELETE`) 대신 `status` 필드를 `CANCELED`로 변경하는 Soft Delete를 적용합니다.
- **Day 3 체크리스트:**
  - [ ] 예약 취소 시 데이터베이스에서 레코드가 지워지지 않고 `status`가 `CANCELED`로 정상 변경되는가?
  - [ ] 타인의 예약 ID로 취소를 요청할 때 권한 예외가 발생하는가?

---

### 🟩 Day 4: React UI 컴포넌트 개발 및 API 연동

- **목표:** 유저가 사용할 대시보드 UI를 완성하고 백엔드 예약 API와 매끄럽게 연결한다.
- **상세 행동 지침:**
  1. **인증 화면 구현:** 로그인 및 회원가입 폼 컴포넌트를 제작하고 세션 연동을 테스트합니다.
  2. **회의실 및 슬롯 타임라인 UI 구현:**
     - 날짜 선택기(`input type="date"`)를 구현합니다.
     - 특정 날짜 선택 시 `GET /api/rooms/{roomId}/available-slots` API를 호출합니다.
  3. **슬롯 계산 알고리즘 (Service 레이어):**
     - Java 8 `java.time` 패키지를 활용합니다.
     - 하루 전체 운영 시간 배열(예: 09:00 ~ 18:00 정시 단위 슬롯)을 생성한 뒤, DB에서 조회된 해당 날짜의 `RESERVED` 상태 예약 시간대 리스트를 차집합으로 제외합니다.
     - 정제된 '예약 가능 시간대' 배열만 프론트엔드로 반환하여 화면에 버튼으로 활성화합니다.
- **Day 4 체크리스트:**
  - [ ] 로그인 후 페이지를 새로고침해도 세션 인증이 잘 유지되는가?
  - [ ] 이미 예약된 시간이 프론트엔드 타임라인 화면에서 비활성화(Disabled) 처리되는가?

---

### 🟦 Day 5: 비관적 락(Pessimistic Lock) 적용 및 동시성 통합 테스트

- **목표:** 동일 시간대 중복 예약(Double Booking) 요청을 가상으로 발생시키고, 비관적 락을 통해 데이터 무결성을 보장한다.
- **상세 행동 지침:**
  1. **비관적 락 적용:**
     - `ReservationRepository` 또는 조회 메서드에 `@Lock(LockModeType.PESSIMISTIC_WRITE)` 어노테이션을 선언합니다.
     - 예약 가능 여부를 조회하는 단계에서 Oracle의 `SELECT ... FOR UPDATE` 쿼리를 발생시켜, 먼저 진입한 트랜잭션이 끝날 때까지 다른 트랜잭션이 해당 로우(Row)에 접근하지 못하고 줄을 서도록 제어합니다.
  2. **동시성 통합 테스트 코드 작성:**
     - `ExecutorService`를 활용해 100개의 멀티 스레드를 생성합니다.
     - `CountDownLatch`를 사용하여 100개의 스레드가 **동시에** 동일한 회의실, 동일한 날짜와 시간으로 `POST /api/reservations` 요청을 보내도록 제어합니다.
     - 100개의 요청 중 **정확히 1개만 성공(성공 데이터 저장)**하고, 나머지 99개는 예외가 발생하는지 `assertThat`으로 검증합니다.
- **Day 5 체크리스트:**
  - [ ] 작성한 동시성 멀티스레드 테스트 코드가 실패 없이 통과하는가?
  - [ ] 콘솔 로그에 `FOR UPDATE` 쿼리가 정상적으로 출력되는가?

---

### 🟪 Day 6: 전역 예외 처리 및 프론트엔드 에러 핸들링 최적화

- **목표:** 동시성 제어 중 발생하는 예외 및 비즈니스 에러를 정제하여 안정적인 UX를 제공한다.
- **상세 행동 지침:**
  1. **글로벌 예외 핸들러 구축:** `@RestControllerAdvice` 클래스를 생성합니다.
  2. **에러 세분화 Catch:**
     - 비관적 락 타임아웃 예외 핸들링.
     - DB 유니크 제약조건 위배 시 발생하는 `DataIntegrityViolationException` 캐치.
     - 비즈니스 커스텀 예외(이미 예약된 시간대 등) 처리.
     - 일관된 에러 응답 포맷(`{ "status": 400, "message": "..." }`) 정의 및 반환.
  3. **React 에러 핸들링:** Axios의 `catch` 블록에서 백엔드가 보낸 에러 메시지를 인터셉트하여 유저에게 "이미 예약이 진행 중이거나 완료된 시간대입니다. 다시 시도해주세요."라고 명확한 팝업 또는 토스트 알림을 제공합니다.
- **Day 6 체크리스트:**
  - [ ] 중복 예약 시 프론트엔드 콘솔에 가공되지 않은 500 내부에러 대신 정제된 400 계열 에러와 메시지가 출력되는가?
  - [ ] 유저 화면에 예외 상황 안내 문구가 끊김 없이 노출되는가?

---

### ⬛ Day 7: 통합 빌드, 리팩토링 및 포트폴리오 문서화

- **목표:** 전체 시스템의 연동을 최종 점검하고 프로젝트를 완성도 있게 마무리한다.
- **상세 행동 지침:**
  1. **통합 구동 확인:** React 프로젝트를 빌드(`npm run build`)하여 Spring Boot static 자원으로 서빙하거나, 완전히 분리된 상태에서 배포 환경 주소를 상정하고 CORS 최종 연동 테스트를 진행합니다.
  2. **코드 리팩토링:** 불필요한 `System.out.println()`, 불명확한 주석, 테스트용 더미 데이터를 제거하고 변수명 및 패키지 구조를 정비합니다.
  3. **README.md 최적화:**
     - 동시성 이슈를 왜 '비관적 락'으로 해결했는지 기술적 당위성을 명시합니다.
     - Day 5에서 수행한 **100개 스레드 동시성 테스트 결과 로그**를 README에 명시하여 기술적 증명(면접 프리패스 포인트)을 강조합니다.
- **Day 7 체크리스트:**
  - [ ] 전체 애플리케이션 흐름(회원가입 -> 로그인 -> 슬롯 조회 -> 예약 -> 취소)에 병목이나 버그가 없는가?
  - [ ] 포트폴리오 검토자가 동시성 해결 과정을 한눈에 이해할 수 있도록 README가 시각적으로 정비되었는가?

---

## 🛠️ 트래픽/동시성 제어 핵심 아키텍처 가시화

```
사용자 A ──(POST /reservations)──► [비관적 락 점유: SELECT ... FOR UPDATE] ──► (성공: DB 저장 및 트랜잭션 커밋)
                                                │ (락 유지 중)
사용자 B ──(POST /reservations)──► [락 대기 (Block 상태)] ───────────────────► (A 커밋 후 진입 -> 중복 검증 걸려 실패)
```
