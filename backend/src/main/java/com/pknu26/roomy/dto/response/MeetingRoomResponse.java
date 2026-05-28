package com.pknu26.roomy.dto.response;

import com.pknu26.roomy.entity.MeetingRoom;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MeetingRoomResponse {

    private Long id; // 클라이언트가 특정 회의실을 식별해서 예약·조회·수정·삭제 같은 다음 동작을 수행할 수 있도록 하기 위해 반환
    private String name;
    private Integer capaticy;

    public static MeetingRoomResponse from(MeetingRoom room) {
        return new MeetingRoomResponse(room.getId(), room.getName(), room.getCapacity());
    }
}
