package com.pknu26.roomy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration; // 추가

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class }) // 추가: 보안 자동 설정 제외
public class RoomyApplication {

    public static void main(String[] args) {
        SpringApplication.run(RoomyApplication.class, args);
    }
}