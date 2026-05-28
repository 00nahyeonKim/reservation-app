package com.pknu26.roomy.repository;

import com.pknu26.roomy.entity.MeetingRoom;
import com.pknu26.roomy.entity.Reservation;
import com.pknu26.roomy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUser(User user);

    List<Reservation> findByRoomAndReservationDate(MeetingRoom room, LocalDate date);

    @Query("""
        SELECT COUNT(r) > 0
        FROM Reservation r
        WHERE r.room = :room
        AND r.reservationDate = :date
        AND r.startTime < :endTime
        AND r.endTime > :startTime
        AND r.status = 'RESERVED'
        """)
    // true = 겹치는 예약 있음 (예약 불가), false = 겹치는 예약 없음 (예약 가능)
    boolean existsOverlap(@Param("room") MeetingRoom room,
                          @Param("date") LocalDate date,
                          @Param("startTime") String startTime,
                          @Param("endTime") String endTime);
}