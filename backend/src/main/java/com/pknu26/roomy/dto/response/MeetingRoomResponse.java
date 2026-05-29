package com.pknu26.roomy.dto.response;

import com.pknu26.roomy.entity.MeetingRoom;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor // Response DTO는 new UserResponse(id, username) 처럼 직접 값을 넣어서 만드니까 @AllArgsConstructor를 씀.
public class MeetingRoomResponse {

    private Long id; // 클라이언트가 특정 회의실을 식별해서 예약·조회·수정·삭제 같은 다음 동작을 수행할 수 있도록 하기 위해 반환
    private String name;
    private Integer capacity;
    private Integer minHeadcount;

    public static MeetingRoomResponse from(MeetingRoom room) {
        return new MeetingRoomResponse(room.getId(), room.getName(), room.getCapacity(), room.getMinHeadcount());
    }
}
