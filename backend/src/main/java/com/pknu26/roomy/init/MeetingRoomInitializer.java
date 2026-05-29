package com.pknu26.roomy.init;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.pknu26.roomy.entity.MeetingRoom;
import com.pknu26.roomy.repository.MeetingRoomRepository;

@Configuration // 이 클래스는 설정 파일이라고 Spring에게 알려줌
public class MeetingRoomInitializer {

    @Bean // CommandLineRunner 타입의 반환 객체를 Spring Bean으로 등록
    @SuppressWarnings("null")
    // 람다식이 CommandLineRunner 인터페이스 구현 객체를 생성하고, 그 객체가 반환된다. 이런 인터페이스를 함수형 인터페이스(Functional Interface) 라고 한다.
    CommandLineRunner initMeetingRooms(MeetingRoomRepository meetingRoomRepository) { // @Bean 메서드 파라미터로 MeetingRoomRepository를 주입받기 때문에 frivate final 필드가 없어도 됨.
        return args -> {
            if (meetingRoomRepository.count() > 0) {
                return;
            }

            List<MeetingRoom> meetingRooms = List.of(
                    MeetingRoom.builder().name("스터디룸 A").capacity(5).minHeadcount(3).build(),
                    MeetingRoom.builder().name("스터디룸 B").capacity(5).minHeadcount(3).build(),
                    MeetingRoom.builder().name("스터디룸 C").capacity(5).minHeadcount(3).build(),
                    MeetingRoom.builder().name("스터디룸 D").capacity(6).minHeadcount(4).build(),
                    MeetingRoom.builder().name("스터디룸 E").capacity(6).minHeadcount(4).build(),
                    MeetingRoom.builder().name("스터디룸 F").capacity(6).minHeadcount(4).build(),
                    MeetingRoom.builder().name("스터디룸 G").capacity(8).minHeadcount(4).build(),
                    MeetingRoom.builder().name("스터디룸 H").capacity(8).minHeadcount(4).build(),
                    MeetingRoom.builder().name("스터디룸 I").capacity(10).minHeadcount(6).build(),
                    MeetingRoom.builder().name("스터디룸 J").capacity(10).minHeadcount(6).build()
            );

            meetingRoomRepository.saveAll(meetingRooms);
        };
    }

}
