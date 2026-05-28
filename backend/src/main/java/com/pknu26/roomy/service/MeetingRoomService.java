package com.pknu26.roomy.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pknu26.roomy.dto.response.MeetingRoomResponse;
import com.pknu26.roomy.entity.MeetingRoom;
import com.pknu26.roomy.exception.CustomException;
import com.pknu26.roomy.exception.ErrorCode;
import com.pknu26.roomy.repository.MeetingRoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor // final 필드를 사용하는 생성자를 자동 생성하여 의존성 주입 처리
@Transactional // 클래스 필드에 있는 에노테이션이므로 이 클래스의 모든 public 메서드에 적용
public class MeetingRoomService {

    private final MeetingRoomRepository meetingRoomRepository;

    @Transactional(readOnly = true)
    // findAll() 메서드 뒤에 {}는 Stream의 람다 표현식이다. 이걸 이용해서 List<MeetingRoomResponse>처럼 DB에서 가져온 엔티티 리스트를 DTO 리스트로 변환한다.
    public List<MeetingRoomResponse> findAll() { // 여기서 사용되는 findAll 이름은 JPA 네이밍 규칙을 따르지 않는 이름을 직접 지은 일반 메서드임. 
        return meetingRoomRepository.findAll().stream()
                .map(MeetingRoomResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public MeetingRoomResponse findById(Long id) {
        MeetingRoom room = meetingRoomRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.ROOM_NOT_FOUND));
        return MeetingRoomResponse.from(room);
    }
}
