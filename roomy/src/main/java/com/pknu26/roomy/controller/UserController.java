package com.pknu26.roomy.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pknu26.roomy.dto.request.SignUpRequest;
import com.pknu26.roomy.dto.response.UserResponse;
import com.pknu26.roomy.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController // REST API용 컨트롤러로 등록하며, return 값을 화면(html)이 아닌 JSON 데이터로 반환
@RequestMapping("/api/users") // 공통 prefix
@RequiredArgsConstructor // final 필드를 사용하는 생성자를 자동 생성하여 의존성 주입 처리
public class UserController {

    private final UserService userService;

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
}
