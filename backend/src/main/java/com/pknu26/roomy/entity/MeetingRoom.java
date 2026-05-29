package com.pknu26.roomy.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 회의실 엔터티
 * DB 테이블명: meeting_room
 * 예약 가능한 회의실의 이름과 최대 수용 인원을 저장한다.
 */
@Entity
@Table(name = "meeting_room")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 기본 생성자 (외부 직접 호출 방지)

public class MeetingRoom {

    /** 기본 키 (PK), MEETING_ROOM_SEQ 시퀀스로 1씩 자동 증가 */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "room_seq_gen") // 시퀀스 방식으로 PK 생성
    @SequenceGenerator(name = "room_seq_gen", sequenceName = "MEETING_ROOM_SEQ", allocationSize = 1) // DB 시퀀스 이름 지정, 1씩 증가
    private Long id;

    /** 회의실 이름 (최대 100자, 필수) */
    @Column(length = 100, nullable = false)
    private String name;

    /** 최대 수용 인원 (단위: 명, 필수) */
    @Column(nullable = false)
    private Integer capacity;

    /** 최소 예약 인원 (단위: 명, 필수) */
    @Column(name = "min_headcount", nullable = false)
    private Integer minHeadcount;

    /** 빌더 패턴 생성자 — MeetingRoom.builder().name(...).capacity(...).minHeadcount(...).build() 형태로 객체 생성 */
    @Builder
    public MeetingRoom(String name, Integer capacity, Integer minHeadcount) {
        this.name = name;
        this.capacity = capacity;
        this.minHeadcount = minHeadcount;
    }
}
