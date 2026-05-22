package com.pknu26.roomy.entity;

import com.pknu26.roomy.entity.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(
        name = "reservation",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_reservation_room_date_start",
                columnNames = {"room_id", "reservation_date", "start_time"}
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reservation_seq_gen")
    @SequenceGenerator(name = "reservation_seq_gen", sequenceName = "RESERVATION_SEQ", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private MeetingRoom room;

    @Column(name = "reservation_date", nullable = false)
    private LocalDate reservationDate;

    @Column(name = "start_time", length = 5, nullable = false)
    private String startTime;

    @Column(name = "end_time", length = 5, nullable = false)
    private String endTime;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private ReservationStatus status;

    @Builder
    public Reservation(User user, MeetingRoom room, LocalDate reservationDate,
                        String startTime, String endTime) {
        this.user = user;
        this.room = room;
        this.reservationDate = reservationDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = ReservationStatus.RESERVED;
    }

    public void cancel() {
        this.status = ReservationStatus.CANCELED;
    }
}
