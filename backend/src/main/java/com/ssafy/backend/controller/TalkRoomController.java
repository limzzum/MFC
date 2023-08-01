package com.ssafy.backend.controller;

import com.ssafy.backend.dto.response.TalkRoomListDto;
import com.ssafy.backend.service.TalkRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.awt.print.Pageable;
import java.util.List;

@RequiredArgsConstructor
g@RequestMapping("/debate")
public class TalkRoomController {

    private final TalkRoomService talkRoomService;

    @GetMapping("/listongoing")
    public ResponseEntity<?> talkroomlist(@RequestParam Long minTalkRoomId,@RequestParam int size) {
        try {
            List<TalkRoomListDto> talkRoomList = talkRoomService.
        }

    }

    @GetMapping("/listwaiting")
    public ResponseEntity<?> talkroomlist(@RequestParam Long minTalkRoomId,@RequestParam int size) {
        try {
            List<TalkRoomListDto> talkRoomListDtos
        }

    }

    @PostMapping
    public ResponseEntity<?> talkroomcreate()

}
