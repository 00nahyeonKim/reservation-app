package com.pknu26.roomy.service;

import org.springframework.stereotype.Service;

import com.pknu26.roomy.dto.request.SignUpRequest;
import com.pknu26.roomy.dto.response.UserResponse;
import com.pknu26.roomy.entity.User;
import com.pknu26.roomy.exception.CustomException;
import com.pknu26.roomy.exception.ErrorCode;
import com.pknu26.roomy.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
// final 필드를 사용하는 생성자를 자동 생성하여 의존성 주입 처리
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;

    // "회원가입 시 아이디는 중복되면 안된다"는 비즈니스 규칙 처리
    public UserResponse signUp(SignUpRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new CustomException(ErrorCode.USERNAME_DUPLICATED);
        }
        // 요청 데이터로 User 객체 생성
        User user = User.builder()
                .username(request.getUsername())
                .password(request.getPassword())
                .build();
            // 저장된 User를 UserResponse로 변환해서 반환
            return UserResponse.from(userRepository.save(user));
    }


}
