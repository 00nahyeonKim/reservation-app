package com.pknu26.roomy.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pknu26.roomy.dto.request.ReservationCreateRequest;
import com.pknu26.roomy.dto.response.ReservationResponse;
import com.pknu26.roomy.exception.CustomException;
import com.pknu26.roomy.exception.ErrorCode;
import com.pknu26.roomy.service.ReservationService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor // final 필드를 사용하는 생성자를 자동 생성하여 Spring의 생성자 주입을 쉽게 함
public class ReservationController {

    private final ReservationService reservationService;

    private static final String SESSION_USER_ID = "LOGIN_USER_ID";

    @PostMapping
    public ResponseEntity<ReservationResponse> create(@RequestBody @Valid ReservationCreateRequest request, HttpSession session) {

        Long userId = getLoginUserId(session);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservationService.create(userId, request));
    }

    private Long getLoginUserId(HttpSession session) {
        Long userId = (Long) session.getAttribute(SESSION_USER_ID);
        if (userId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }
        return userId;
    }
}
