package com.pknu26.roomy.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 사용자 엔터티
 * DB 테이블명: users
 * 로그인에 사용하는 아이디(username)와 비밀번호(password)를 저장한다.
 */
@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 기본 생성자 (외부 직접 호출 방지)
public class User {

    /** 기본 키 (PK), USER_SEQ 시퀀스로 1씩 자동 증가 */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq_gen") // 시퀀스 방식으로 PK 생성
    @SequenceGenerator(name = "user_seq_gen", sequenceName = "USER_SEQ", allocationSize = 1) // DB 시퀀스 이름 지정, 1씩 증가
    private Long id;

    /** 로그인 아이디 (최대 20자, 필수, 중복 불가) */
    @Column(length = 20, nullable = false, unique = true)
    private String username;

    /** 비밀번호 (암호화된 문자열 저장, 최대 255자) */
    @Column(length = 255, nullable = false)
    private String password;

    /** 빌더 패턴 생성자 — User.builder().username(...).password(...).build() 형태로 객체 생성 */
    @Builder
    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

}
