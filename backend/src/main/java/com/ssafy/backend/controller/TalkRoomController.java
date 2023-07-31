package com.ssafy.backend.controller;

import com.ssafy.backend.dto.response.TalkRoomListDto;
import com.ssafy.backend.service.TalkRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.awt.print.Pageable;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/debate")
public class TalkRoomController {

    private final TalkRoomService talkRoomService;

    @GetMapping("/listPerPage")
    public ResponseEntity<?> talkroomlist(Pageable pageable) {
        try {
            List<TalkRoomListDto> talkRoomListDtos
        }

    }

}
