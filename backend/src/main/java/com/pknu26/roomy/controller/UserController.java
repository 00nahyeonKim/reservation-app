package com.pknu26.roomy.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pknu26.roomy.dto.request.LoginRequest;
import com.pknu26.roomy.dto.request.SignUpRequest;
import com.pknu26.roomy.dto.response.UserResponse;
import com.pknu26.roomy.entity.User;
import com.pknu26.roomy.exception.CustomException;
import com.pknu26.roomy.exception.ErrorCode;
import com.pknu26.roomy.service.UserService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController // REST API용 컨트롤러로 등록하며, return 값을 화면(html)이 아닌 JSON 데이터로 반환
@RequestMapping("/api/users") // 공통 prefix
@RequiredArgsConstructor // final 필드를 사용하는 생성자를 자동 생성하여 의존성 주입 처리
public class UserController {

    private final UserService userService;
    private static final String SESSION_USER_ID = "LOGIN_USER_ID";

    @PostMapping("/signup")
/*  ResponseEntity: HTTP 응답 전체(상태코드, body 등)를 표현하는 객체
    <UserResponse>: 그 응답 안에 들어가는 데이터 타입
    즉, UserResponse 데이터를 담는 HTTP 응답 */
    public ResponseEntity<UserResponse> signUp(@RequestBody @Valid SignUpRequest request) {
        // @RequestBody 어노테이션은 HTTP 요청 body(JSON)를 Java 객체(SignUpRequest)로 바꿔달라는 의미
        UserResponse response = userService.signUp(request);
        // 이 코드의 반환값은 ResponseEntity<UserResponse> 객체
        return ResponseEntity.status(HttpStatus.CREATED).body(response); // 상태코드 + body 데이터가 포함된 완성된 ResponseEntity 생성.

/*      
실제 응답: 

        HTTP/1.1 201 Created
        {
        "id": 1,
        "username": "kim"
        } 
*/
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody @Valid LoginRequest request, HttpSession session) {

        User user = userService.login(request);
        session.setAttribute(SESSION_USER_ID, user.getId());
        return ResponseEntity.ok(UserResponse.from(user)); // ResponseEntity.ok()는 HTTP 상태코드 200 OK 생성
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) { // 응답 body 없는 HTTP 응답 객체
        session.invalidate();
        return ResponseEntity.ok().build(); // .build()는 body 없이 최종 응답 객체 생성
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyInfo(HttpSession session) {
        Long userId = getLoginUserId(session);
        User user = userService.findById(userId);
        return ResponseEntity.ok(UserResponse.from(user));
    }

    // 헬퍼 메서드 (관례적으로 클래스 마지막에 추가)
    private Long getLoginUserId(HttpSession session) {
        Long userId = (Long) session.getAttribute(SESSION_USER_ID);
        if (userId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }
        return userId;
    }
}
