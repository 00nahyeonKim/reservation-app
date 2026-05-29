package com.pknu26.roomy.service;

import java.time.Duration;
import java.time.LocalTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pknu26.roomy.dto.request.ReservationCreateRequest;
import com.pknu26.roomy.dto.response.ReservationResponse;
import com.pknu26.roomy.entity.MeetingRoom;
import com.pknu26.roomy.entity.Reservation;
import com.pknu26.roomy.entity.User;
import com.pknu26.roomy.exception.CustomException;
import com.pknu26.roomy.exception.ErrorCode;
import com.pknu26.roomy.repository.MeetingRoomRepository;
import com.pknu26.roomy.repository.ReservationRepository;
import com.pknu26.roomy.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor // final 필드를 사용하는 생성자를 자동 생성하여 의존성 주입 처리
@Transactional // 클래스 필드에 있는 에노테이션이므로 이 클래스의 모든 public 메서드에 적용
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final MeetingRoomRepository meetingRoomRepository;

    public ReservationResponse create(Long userId, ReservationCreateRequest request) {
        // 1. 세션에서 전달된 userId로 로그인 유저 조회 — 없으면 404
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 2. 요청에서 넘어온 roomId로 회의실 조회 — 없으면 404
        MeetingRoom room = meetingRoomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new CustomException(ErrorCode.ROOM_NOT_FOUND));

        // 3. 시간 유효성 검증 (시작 < 종료, 30분 이상 4시간 이하)
        validateReservationTime(request.getStartTime(), request.getEndTime());

        // 4. 최소 인원 검증 — 요청 인원이 해당 회의실의 최소 인원보다 적으면 400
        if (request.getHeadCount() < room.getMinHeadcount()) {
            throw new CustomException(ErrorCode.RESERVATION_BELOW_MIN_CAPACITY);
        }

        // 5. 중복 예약 검증 — 같은 방·날짜에 시간이 겹치는 예약이 이미 있으면 409
        if (reservationRepository.existsOverlap(
                room, request.getReservationDate(),
                request.getStartTime(), request.getEndTime())) {
            throw new CustomException(ErrorCode.RESERVATION_DUPLICATED);
        }

        // 6. 예약 엔터티 생성 후 저장
        Reservation reservation = Reservation.builder()
                .user(user)
                .room(room)
                .reservationDate(request.getReservationDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .headCount(request.getHeadCount())
                .build();

        // save() 후 반환된 영속 엔터티를 DTO로 변환해 반환
        return ReservationResponse.from(reservationRepository.save(reservation));
    }

    // LocalTime은 Java의 java.time 패키지에 있는 시간만 표현하는 클래스
    private void validateReservationTime(LocalTime start, LocalTime end) {
        // 시작 시간이 종료 시간과 같거나 이후이면 400
        if (!start.isBefore(end)) {
            throw new CustomException(ErrorCode.INVALID_RESERVATION_TIME);
        }
        // Duration.between: 두 LocalTime 사이의 시간 간격을 계산 → toMinutes()로 분 단위 변환
        long minutes = Duration.between(start, end).toMinutes();
        if (minutes < 30 || minutes > 240) {
            throw new CustomException(ErrorCode.INVALID_RESERVATION_DURATION);
        }
    }
}
