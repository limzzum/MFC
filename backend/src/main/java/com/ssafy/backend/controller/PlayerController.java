package com.ssafy.backend.controller;

import com.ssafy.backend.dto.Message;
import com.ssafy.backend.dto.request.*;
import com.ssafy.backend.service.PlayerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/player")
@Slf4j
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PlayerController {

    private final PlayerService playerService;

    @PostMapping
    public ResponseEntity<Message> regist(@RequestBody PlayerRegistDto playerRegistDto){
        Long playerId = playerService.regist(playerRegistDto);
        if (playerId == null) {
            return ResponseEntity.ok(new Message(HttpStatus.OK, "등록 실패", null));
        }
        return ResponseEntity.ok(new Message(HttpStatus.OK, "등록 성공", playerId));

    }

    @PatchMapping("/{isReady}")
    public ResponseEntity<Message> changeStatus(@RequestBody PlayerDto playerDto, @PathVariable boolean isReady){
        boolean allReady = playerService.changeStatus(playerDto, isReady);
        return ResponseEntity.ok(new Message(HttpStatus.OK, "모든 플레이어 준비 상태", allReady));
    }

    @PatchMapping
    public ResponseEntity<Message> modify(@RequestBody PlayerUpdateDto playerUpdateDto){
        playerService.modify(playerUpdateDto);
        return ResponseEntity.ok(new Message(HttpStatus.OK, "업데이트 완료", null));
    }

    @GetMapping("/over")
    public ResponseEntity<Message> over(PlayerDto playerDto){
        boolean result = playerService.overTalk(playerDto);
        if(result){
            return ResponseEntity.ok(new Message(HttpStatus.OK, "연장 성공", null));
        }
        return ResponseEntity.ok(new Message(HttpStatus.BAD_REQUEST, "연장횟수초과", null));
    }

}
