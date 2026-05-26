package com.pknu26.roomy.entity.enums;

/**
 * 예약 상태를 나타내는 Enum
 * Reservation 엔터티의 status 필드에 사용되며, DB에는 문자열로 저장된다.
 */
public enum ReservationStatus {
    RESERVED,  // 예약 완료 (정상 예약 상태)
    CANCELED   // 예약 취소됨
}
