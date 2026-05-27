package com.pknu26.roomy.repository;

import com.pknu26.roomy.entity.MeetingRoom;
import com.pknu26.roomy.entity.Reservation;
import com.pknu26.roomy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUser(User user);

    List<Reservation> findByRoomAndReservationDate(MeetingRoom room, LocalDate date);

    boolean existsByRoomAndReservationDateAndStartTime(
            MeetingRoom room, LocalDate reservationDate, String startTime);
}
