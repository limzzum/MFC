package com.ssafy.backend.controller;

import com.ssafy.backend.dto.Message;
import com.ssafy.backend.dto.request.RoomInfoRuquestDto;
import com.ssafy.backend.dto.response.RoomFinToPlayerDto;
import com.ssafy.backend.dto.response.RoomInfoResponseDto;
import com.ssafy.backend.dto.response.RoomListDto;
import com.ssafy.backend.service.HistoryService;
import com.ssafy.backend.service.ParticipantService;
import com.ssafy.backend.service.RoomResultService;
import com.ssafy.backend.service.RoomService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/debateResult")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class RoomResultController {

    private final RoomResultService roomResultService;
    private final ParticipantService participantService;
    private final HistoryService historyService;
    @PatchMapping("reset/{roomId}")
    public ResponseEntity<?> roomReset(@PathVariable Long roomId) {
        Message message = roomResultService.roomReset(roomId);
        if(message.getStatus() == HttpStatus.OK) {
            participantService.resetParticipants(roomId);
            message.setMessage("토론방 관련 정보 리셋 성공");
        }
        return ResponseEntity.ok(message);
    }

    @GetMapping("result/{roomId}/{userId}")
    public ResponseEntity<?> roomFinInfo(@PathVariable Long roomId, @PathVariable Long userId) {
        Message message = roomResultService.roomResult(userId,roomId);
        if(message.getMessage().equals("플레이어에게 토론 결과 보내기 성공")) {
            historyService.roomFin((RoomFinToPlayerDto) message.getData(),userId);
        }
        return ResponseEntity.ok(message);
    }


}
