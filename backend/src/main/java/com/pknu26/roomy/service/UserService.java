package com.pknu26.roomy.service;

import org.springframework.stereotype.Service;

import com.pknu26.roomy.dto.request.LoginRequest;
import com.pknu26.roomy.dto.request.SignUpRequest;
import com.pknu26.roomy.dto.response.UserResponse;
import com.pknu26.roomy.entity.User;
import com.pknu26.roomy.exception.CustomException;
import com.pknu26.roomy.exception.ErrorCode;
import com.pknu26.roomy.repository.UserRepository;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor // final 필드를 사용하는 생성자를 자동 생성하여 의존성 주입 처리
@Transactional // 클래스 필드에 있는 에노테이션이므로 이 클래스의 모든 public 메서드에 적용
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

    // User 객체 자체를 반환
    @Transactional(readOnly = true) // readOnly = true로 오버라이드 하기 위해 Transactional 에노테이션 사용
    public User login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        if (!user.getPassword().equals(request.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }
        return user;
    }

    @Transactional(readOnly = true) // readOnly = true로 오버라이드 하기 위해 Transactional 에노테이션 사용
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }
}
