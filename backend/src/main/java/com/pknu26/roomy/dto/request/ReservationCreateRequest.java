package com.pknu26.roomy.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor // Request DTO는 JSON을 객체로 변환할 때 Jackson이 기본 생성자를 필요로 해서 @NoArgsConstructor를 사용.
public class ReservationCreateRequest {

    @NotNull(message = "회의실을 선택해주세요.")
    private Long roomId;

    @NotNull(message = "예약 날짜를 입력해주세요.")
    private LocalDate reservationDate;

    @NotNull(message = "시작 시간을 입력해주세요.")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;

    @NotNull(message = "종료 시간을 입력해주세요.")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;

    @NotNull(message = "예약 인원을 입력해주세요.")
    private Integer headCount;
}
