package com.pknu26.roomy.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // 사용자
    USER_NOT_FOUND(404, "사용자를 찾을 수 없습니다."),
    USERNAME_DUPLICATED(409, "이미 사용 중인 아이디입니다."),
    INVALID_PASSWORD(401, "비밀번호가 올바르지 않습니다."),

    // 인증
    UNAUTHORIZED(401, "로그인이 필요합니다."),
    FORBIDDEN(403, "권한이 없습니다."),

    // 회의실
    ROOM_NOT_FOUND(404, "회의실을 찾을 수 없습니다."),

    // 예약
    RESERVATION_NOT_FOUND(404, "예약을 찾을 수 없습니다."),
    RESERVATION_DUPLICATED(409, "해당 시간에 이미 예약이 있습니다."),
    RESERVATION_BELOW_MIN_CAPACITY(400, "최소 예약 인원을 충족하지 못했습니다."),
    INVALID_RESERVATION_TIME(400, "시작 시간은 종료 시간보다 이전이어야 합니다."),
    INVALID_RESERVATION_DURATION(400, "예약은 30분 이상 4시간 이하여야 합니다.");

    private final int status;
    private final String message;
}
