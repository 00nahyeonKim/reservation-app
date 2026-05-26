# Spring Boot DTO / Entity 데이터 흐름 정리

## 전체 계층 구조

```text
Client
  ↓
Controller
  ↓
DTO
  ↓
Service
  ↓
Entity
  ↓
Repository(JPA)
  ↓
DB
```

---

# 계층별 역할

## Client

프론트엔드 또는 외부 사용자가 서버에 요청을 보낸다.

예:

```json
{
  "username": "kim",
  "password": "123456789"
}
```

---

## Controller

클라이언트 요청을 받는 계층.

- Request DTO로 요청 데이터를 받음
- 입력값 검증 수행
- Service 호출

예:

```java
@PostMapping("/signup")
public ResponseEntity<?> signup(
        @Valid @RequestBody SignUpRequest request
) {
    userService.signup(request);

    return ResponseEntity.ok().build();
}
```

---

## DTO (Data Transfer Object)

데이터 전달용 객체.

역할:

- 요청 데이터 전달
- 응답 데이터 전달
- 입력값 검증
- Entity 보호

예:

```java
public class SignUpRequest {

    @NotBlank
    @Size(min = 6, max = 20)
    private String username;

    @NotBlank
    @Size(min = 9, max = 15)
    private String password;
}
```

DTO를 사용하는 이유:

- Entity 직접 노출 방지
- API 구조와 DB 구조 분리
- 사용자 입력 검증
- 필요한 데이터만 전달

---

## Service

비즈니스 로직 처리 계층.

예:

- 회원가입
- 로그인
- 비밀번호 암호화
- 중복 회원 검사

DTO를 Entity로 변환하는 작업도 여기서 많이 수행한다.

예:

```java
public void signup(SignUpRequest request) {

    User user = User.builder()
            .username(request.getUsername())
            .password(passwordEncoder.encode(request.getPassword()))
            .build();

    userRepository.save(user);
}
```

---

## Entity

DB 테이블과 매핑되는 객체.

예:

```java
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue
    private Long id;

    private String username;

    private String password;
}
```

특징:

- DB 저장 구조 표현
- JPA가 관리
- Repository를 통해 저장/조회

---

## Repository (JPA)

Entity를 DB에 저장하거나 조회하는 계층.

예:

```java
userRepository.save(user);
```

JPA가 SQL을 대신 생성해준다.

---

## DB

실제 데이터가 저장되는 공간.

---

# 요청(Request) 흐름

```text
Request JSON
→ Request DTO
→ Service
→ Entity
→ DB
```

설명:

1. 클라이언트가 JSON 요청 전송
2. Controller가 Request DTO로 받음
3. DTO 검증 수행
4. Service에서 비즈니스 로직 처리
5. DTO → Entity 변환
6. DB 저장

---

# 응답(Response) 흐름

```text
DB
→ Entity
→ Response DTO
→ Response JSON
```

설명:

1. DB에서 Entity 조회
2. 필요한 데이터만 Response DTO로 변환
3. JSON 형태로 클라이언트에 반환

---

# 왜 Response DTO를 사용하는가?

예를 들어 Entity:

```java
public class User {
    private Long id;
    private String username;
    private String password;
}
```

password는 외부에 노출되면 안 된다.

따라서:

```java
public class UserResponse {
    private String username;
}
```

처럼 필요한 값만 응답한다.

---

# 핵심 정리

## DTO

- 데이터 전달 객체
- 요청/응답 처리
- 입력 검증
- Entity 보호

## Entity

- DB 테이블 매핑 객체
- JPA 관리 대상
- 실제 저장 구조

## Service

- 비즈니스 로직 처리
- DTO ↔ Entity 변환

---

# 최종 흐름 요약

```text
[요청]
Client
→ JSON
→ Request DTO
→ Service
→ Entity
→ DB

[응답]
DB
→ Entity
→ Response DTO
→ JSON
→ Client
```

