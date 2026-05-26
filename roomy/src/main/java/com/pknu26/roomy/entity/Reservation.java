package com.pknu26.roomy.entity;

import com.pknu26.roomy.entity.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * 예약 엔터티
 * DB 테이블명: reservation
 * 누가(user) 어떤 회의실(room)을 언제(reservationDate) 몇 시부터(startTime) 몇 시까지(endTime) 예약했는지 기록한다.
 * 유니크 제약: 같은 회의실·날짜·시작시간에 중복 예약 불가 (uk_reservation_room_date_start)
 */
@Entity
@Table(
        name = "reservation",
        uniqueConstraints = @UniqueConstraint(
                // 동일 회의실, 동일 날짜, 동일 시작 시간으로 중복 예약되는 것을 DB 레벨에서 방지
                name = "uk_reservation_room_date_start",
                columnNames = {"room_id", "reservation_date", "start_time"}
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 기본 생성자 (외부 직접 호출 방지)

public class Reservation {

    /** 기본 키 (PK), RESERVATION_SEQ 시퀀스로 1씩 자동 증가 */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reservation_seq_gen") // 시퀀스 방식으로 PK 생성
    @SequenceGenerator(name = "reservation_seq_gen", sequenceName = "RESERVATION_SEQ", allocationSize = 1) // DB 시퀀스 이름 지정, 1씩 증가
    private Long id;

    /** 예약자 (users 테이블 FK, 지연 로딩 — 실제 사용 시점에 쿼리 실행) */
    @ManyToOne(fetch = FetchType.LAZY) // N:1 관계, LAZY = 필요할 때만 User 조회
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 예약 대상 회의실 (meeting_room 테이블 FK, 지연 로딩) */
    @ManyToOne(fetch = FetchType.LAZY) // N:1 관계, LAZY = 필요할 때만 MeetingRoom 조회
    @JoinColumn(name = "room_id", nullable = false)
    private MeetingRoom room;

    /** 예약 날짜 (예: 2025-06-01) */
    @Column(name = "reservation_date", nullable = false)
    private LocalDate reservationDate;

    /** 예약 시작 시간, "HH:mm" 형식으로 저장 (예: "09:00") */
    @Column(name = "start_time", length = 5, nullable = false)
    private String startTime;

    /** 예약 종료 시간, "HH:mm" 형식으로 저장 (예: "10:00") */
    @Column(name = "end_time", length = 5, nullable = false)
    private String endTime;

    /** 예약 상태 (RESERVED: 예약 중 / CANCELED: 취소됨), DB에 Enum 이름 문자열로 저장 */
    @Enumerated(EnumType.STRING) // DB에 숫자(ordinal) 대신 문자열("RESERVED", "CANCELED")로 저장
    @Column(length = 20, nullable = false)
    private ReservationStatus status;

    /**
     * 빌더 패턴 생성자
     * 생성 시 status는 자동으로 RESERVED(예약 완료) 상태로 초기화된다.
     */
    @Builder
    public Reservation(User user, MeetingRoom room, LocalDate reservationDate,
                        String startTime, String endTime) {
        this.user = user;
        this.room = room;
        this.reservationDate = reservationDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = ReservationStatus.RESERVED; // 신규 예약은 항상 RESERVED 상태로 시작
    }

    /** 예약을 취소한다. status를 CANCELED로 변경한다. */
    public void cancel() {
        this.status = ReservationStatus.CANCELED;
    }
}
