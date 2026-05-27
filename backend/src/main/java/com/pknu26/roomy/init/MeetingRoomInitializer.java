package com.pknu26.roomy.init;

import com.pknu26.roomy.entity.MeetingRoom;
import com.pknu26.roomy.repository.MeetingRoomRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MeetingRoomInitializer {

    @Bean
    @SuppressWarnings("null")
    CommandLineRunner initMeetingRooms(MeetingRoomRepository meetingRoomRepository) {
        return args -> {
            if (meetingRoomRepository.count() > 0) {
                return;
            }

            meetingRoomRepository.save(MeetingRoom.builder().name("스터디룸 A").capacity(5).build());
            meetingRoomRepository.save(MeetingRoom.builder().name("스터디룸 B").capacity(5).build());
            meetingRoomRepository.save(MeetingRoom.builder().name("스터디룸 C").capacity(5).build());
            meetingRoomRepository.save(MeetingRoom.builder().name("스터디룸 D").capacity(8).build());
            meetingRoomRepository.save(MeetingRoom.builder().name("스터디룸 E").capacity(8).build());
        };
    }
}
