package com.pknu26.roomy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pknu26.roomy.entity.MeetingRoom;

public interface MeetingRoomRepository extends JpaRepository<MeetingRoom, Long>{
    // 기본 CRUD만 사용하므로 추가 메서드 없음
}