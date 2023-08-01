package com.ssafy.backend.controller;

import com.ssafy.backend.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;

@RequiredArgsConstructor
@RequestMapping("/debate")
public class RoomController {

    private final RoomService roomService;

//    @GetMapping("/listongoing")
//    public ResponseEntity<?> talkroomlist(@RequestParam Long minTalkRoomId,@RequestParam int size) {
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
