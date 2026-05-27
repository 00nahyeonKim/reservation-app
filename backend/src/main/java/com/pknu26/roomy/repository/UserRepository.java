package com.pknu26.roomy.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pknu26.roomy.entity.User;

public interface UserRepository extends JpaRepository<User, Long>{

    // username으로 사용자 조회 (로그인, 중복 검사에 사용)
    Optional<User> findByUsername(String username);

    // username 존재 여부 확인 (화원가입 중복 검사)
    boolean existsByUsername(String username);
}
