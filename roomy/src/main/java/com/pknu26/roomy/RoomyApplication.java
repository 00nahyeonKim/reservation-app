package com.pknu26.roomy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@SpringBootApplication
@RestController
@CrossOrigin(origins = "http://localhost:5173") // 프론트엔드 주소 허용
public class RoomyApplication {

    public static void main(String[] args) {
        SpringApplication.run(RoomyApplication.class, args);
    }

    // 1. 회의실 목록 조회 API
    @GetMapping("/api/rooms")
    public List<Map<String, Object>> getRooms() {
        return List.of(
            Map.of("id", 1, "name", "대회의실 A", "capacity", 15),
            Map.of("id", 2, "name", "소회의실 B", "capacity", 6)
        );
    }

    // 2. 시간표 조회 API
    @GetMapping("/api/rooms/timeslots")
    public Map<String, Boolean> getTimeslots(@RequestParam("room-id") Long roomId) {
        return Map.of("09:00", true, "10:00", false, "11:00", true);
    }

    // 3. 예약 생성 API
    @PostMapping("/api/reservations")
    public Map<String, Object> createReservation(@RequestBody Map<String, Object> req) {
        return Map.of("name", "회의실 A", "status", "success");
    }
}