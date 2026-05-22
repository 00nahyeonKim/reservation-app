package com.pknu26.roomy.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)  // 기본 생성자 자동 생성

public class User {

    @Id // PK 지정
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq_gen") // 시퀀스 쓸게
    @SequenceGenerator(name = "user_seq_gen", sequenceName = "USER_SEQ", allocationSize = 1)    // 어떤 시퀀스?
    private Long id;

    @Column(length = 20, nullable = false, unique = true)
    private String username;

    @Column(length = 255, nullable = false)
    private String password;

    @Builder
    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

}
