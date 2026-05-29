package com.pknu26.roomy.dto.response;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import com.pknu26.roomy.entity.Reservation;
import com.pknu26.roomy.entity.enums.ReservationStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor // Response DTO는 new UserResponse(id, username) 처럼 직접 값을 넣어서 만드니까 @AllArgsConstructor를 씀.
public class ReservationResponse {

    private Long id; // 취소/수정/삭제 요청 URL에 /reservations/{id} 형태로 사용하기 위해 포함. 클라이언트 화면에 보이진 않음.
    private String username;
    private String roomName;
    private LocalDate reservationDate;
    private String startTime;
    private String endTime;
    private String status;
    private Integer headCount;

    public static ReservationResponse from(Reservation reservation) {
        return new ReservationResponse(
            reservation.getId(), 
            reservation.getUser().getUsername(),
            reservation.getRoom().getName(),
            reservation.getReservationDate(),
            reservation.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")),
            reservation.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm")),
            // Reservation 객체를 생성하면 status 필드에 ReservationStatus.RESERVED (Enum 타입)가 저장되는데, Enum 기본 메서드인 name()으로 문자열 RESERVED 로 변환해서 넣음.
            reservation.getStatus().name(),
            reservation.getHeadCount() 
        );
    }
}
