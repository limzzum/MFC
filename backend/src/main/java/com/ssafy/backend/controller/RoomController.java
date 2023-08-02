package com.ssafy.backend.controller;

import com.ssafy.backend.dto.response.RoomListDto;
import com.ssafy.backend.service.RoomService;
import java.util.HashMap;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/debate")
public class RoomController {

    private final RoomService roomService;

    @GetMapping("/list/ongoing")
    public ResponseEntity<?> ongoingRoomList(@RequestParam Long minRoomId,@RequestParam int size) {
//        try {
        System.out.println("----1-----");
        List<RoomListDto> talkRoomList = roomService.ongoingRoomList(minRoomId,size);
        System.out.println("----2-----");
        return ResponseEntity.ok(talkRoomList);
//        }

    };

    @GetMapping("/list/waiting")
    public ResponseEntity<?> waitingRoomList(@RequestParam Long minRoomId,@RequestParam int size) {
//        try {
        System.out.println("----1-----");
        List<RoomListDto> talkRoomList = roomService.waitingRoomList(minRoomId,size);
        System.out.println("----2-----");
        return ResponseEntity.ok(talkRoomList);
//        }

    }

//
//    @PostMapping
//    public ResponseEntity<?> talkroomcreate()

}
