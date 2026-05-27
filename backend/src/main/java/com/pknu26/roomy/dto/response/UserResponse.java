package com.pknu26.roomy.dto.response;

import com.pknu26.roomy.entity.User;

import lombok.AllArgsConstructor;
import lombok.Getter;

// Entity → Response DTO 변환
@Getter
// Response DTO는 new UserResponse(id, username) 처럼 직접 값을 넣어서 만드니까 @AllArgsConstructor를 씀.
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String username;

    // static인 이유: 객체 생성 없이 호출 가능하고, 새 DTO 객체를 생성해서 반환하는 역할이기 때문
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getUsername());
    }
}
