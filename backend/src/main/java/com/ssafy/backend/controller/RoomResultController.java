package com.ssafy.backend.controller;

import com.ssafy.backend.dto.Message;
import com.ssafy.backend.dto.MethodResultDto;
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
    public ResponseEntity<?> roomReset(@PathVariable Long roomId) { // 이것도 중복처리되면 안됨 모든 방에 있는 클라이언트가 보내면 중복으로 처리 x
        Message message = roomResultService.roomReset(roomId);
        if(message.getStatus() == HttpStatus.OK) {
            participantService.resetParticipants(roomId);
            message.setMessage("토론방 관련 정보 리셋 성공");
        }
        return ResponseEntity.ok(message);
    }

    @GetMapping("{roomId}/{userId}") // 시간 종료, 생명게이지 0일 때 방에 있는 모든 클라이언트가 각각 보냄
    public ResponseEntity<?> roomResult(@PathVariable Long roomId, @PathVariable Long userId) {
        MethodResultDto methodResultDto = roomResultService.roomResult(false,false,userId,roomId);
        Message message = new Message(HttpStatus.OK, "", null);
        if(!methodResultDto.isResult()){
            message.setStatus(HttpStatus.BAD_REQUEST);
            message.setMessage(methodResultDto.getMessage());
        }else {
            message.setMessage("토론 결과 조회 성공");
            message.setData(methodResultDto.getData());
        }
        return ResponseEntity.ok(message);
    }

    @GetMapping("surrender/{roomId}/{userId}")
    public ResponseEntity<?> playerSurrenderResult(@PathVariable Long roomId, @PathVariable Long userId) {
        MethodResultDto methodResultDto = roomResultService.roomResult(true,false,userId,roomId);
        Message message = new Message(HttpStatus.OK, "", null);
        if(!methodResultDto.isResult()){
            message.setStatus(HttpStatus.BAD_REQUEST);
            message.setMessage(methodResultDto.getMessage());
        }else {
            message.setMessage("토론 결과 조회 성공");
            message.setData(methodResultDto.getData());
        }
        return ResponseEntity.ok(message);
    }

    @GetMapping("out/{roomId}/{userId}")
    public ResponseEntity<?> playerOutResult(@PathVariable Long roomId, @PathVariable Long userId) {
        MethodResultDto methodResultDto = roomResultService.roomResult(false,true,userId,roomId);
        Message message = new Message(HttpStatus.OK, "", null);
        if(!methodResultDto.isResult()){
            message.setStatus(HttpStatus.BAD_REQUEST);
            message.setMessage(methodResultDto.getMessage());
        }else {
            message.setMessage("토론 결과 조회 성공");
            message.setData(methodResultDto.getData());
        }
        return ResponseEntity.ok(message);
    }



}
