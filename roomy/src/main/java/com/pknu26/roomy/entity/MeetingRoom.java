package com.pknu26.roomy.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "meeting_room")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MeetingRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "room_seq_gen")
    @SequenceGenerator(name = "room_seq_gen", sequenceName = "MEETING_ROOM_SEQ", allocationSize = 1)
    private Long id;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer capacity;

    @Builder
    public MeetingRoom(String name, Integer capacity) {
        this.name = name;
        this.capacity = capacity;
    }
}
