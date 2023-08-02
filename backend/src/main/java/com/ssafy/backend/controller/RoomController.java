package com.ssafy.backend.controller;

import com.ssafy.backend.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RequiredArgsConstructor
@RequestMapping("/debate")
public class RoomController {

    private final RoomService roomService;

//    @GetMapping("/listongoing")
//    public ResponseEntity<?> talkroomlist(@RequestParam int page ,@RequestParam int size) {
//        try {
//            List<TalkRoomListDto> talkRoomList = talkRoomService.
//        }
//
//    }
//
//    @GetMapping("/listwaiting")
//    public ResponseEntity<?> talkroomlist(@RequestParam Long minTalkRoomId,@RequestParam int size) {
//        try {
//            List<TalkRoomListDto> talkRoomListDtos
//        }
//
//    }
//
//    @PostMapping
//    public ResponseEntity<?> talkroomcreate()

}
