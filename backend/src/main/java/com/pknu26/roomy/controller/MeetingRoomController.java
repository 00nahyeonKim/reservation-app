package com.pknu26.roomy.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pknu26.roomy.dto.response.MeetingRoomResponse;
import com.pknu26.roomy.service.MeetingRoomService;

import lombok.RequiredArgsConstructor;

@RestController // REST API용 컨트롤러로 등록하며, return 값을 화면(html)이 아닌 JSON 데이터로 반환. @Controller와 @ResponseBody를 합친 축약형. 프론트엔드와 백엔드 분리를 쉽게하기 위함.
@RequestMapping("/api/rooms")
@RequiredArgsConstructor // final 필드를 사용하는 생성자를 자동 생성하여 Spring의 생성자 주입을 쉽게 함
public class MeetingRoomController {

    private final MeetingRoomService meetingRoomService;

    @GetMapping
/*  ResponseEntity: HTTP 응답 전체(상태코드, body 등)를 표현하는 객체
    <>: 그 응답 안에 들어가는 데이터 타입
    즉, <>안의 데이터를 담는 HTTP 응답 */
    public ResponseEntity<List<MeetingRoomResponse>> findAll() {
        return ResponseEntity.ok(meetingRoomService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MeetingRoomResponse> findById(@PathVariable("id") Long id) { // @PathVariable은 URL 경로에 들어있는 값을 메서드 파라미터로 꺼내오는 어노테이션
        return ResponseEntity.ok(meetingRoomService.findById(id));
    }

}
