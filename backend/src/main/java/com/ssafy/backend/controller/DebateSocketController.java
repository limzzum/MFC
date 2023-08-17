package com.ssafy.backend.controller;

import com.ssafy.backend.dto.Message;
import com.ssafy.backend.dto.MethodResultDto;
import com.ssafy.backend.dto.request.RoomInfoRuquestDto;
import com.ssafy.backend.dto.response.ParticipantOutDto;
import com.ssafy.backend.dto.response.RoomInfoResponseDto;
import com.ssafy.backend.dto.response.ViewerDto;
import com.ssafy.backend.entity.Participant;
import com.ssafy.backend.file.FileStore;
import com.ssafy.backend.service.RoomResultService;
import com.ssafy.backend.service.RoomService;
import com.ssafy.backend.service.ViewerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;

@RestController
@RequiredArgsConstructor
@Transactional
public class DebateSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final RoomService roomService;
    private final RoomResultService roomResultService;
    private final ViewerService viewerService;
    private final FileStore fileStore;

    @MessageMapping("/room/update/{roomId}")
    public void roomUpdate(@DestinationVariable Long roomId, RoomInfoRuquestDto roomInfoRuquestDto) {
        RoomInfoResponseDto updatedRoom = roomService.updateRoom(roomId, roomInfoRuquestDto);
        if (updatedRoom == null) {
            // 예외처리할것
        }
        messagingTemplate.convertAndSend("/from/room/update/" + roomId, updatedRoom);
    }

    @MessageMapping("/room/surrender/{roomId}/{userId}")
    public void playerSurrenderResult(@DestinationVariable Long roomId, @DestinationVariable Long userId) {
        MethodResultDto methodResultDto = roomResultService.roomResult(true,false,userId,roomId);
        if(!methodResultDto.isResult()){
            //예외처리
        }else {
            messagingTemplate.convertAndSend("/from/room/surrender/" + roomId, methodResultDto.getData());
        }
    }
    @MessageMapping("/room/playerout/{roomId}/{userId}")
    public void playerOutResult(@DestinationVariable Long roomId, @DestinationVariable Long userId) {
        MethodResultDto methodResultDto = roomResultService.roomResult(false,true,userId,roomId);
        if(!methodResultDto.isResult()){
            //예외처리
        }else {
            messagingTemplate.convertAndSend("/from/room/playerout/" + roomId, methodResultDto.getData());
        }
    }
    @MessageMapping("/room/enter/{roomId}/{userId}")
    public void enterRoom(@DestinationVariable Long roomId, @DestinationVariable Long userId) {
        ViewerDto viewerDto = null;
        if (viewerService.existsUser(userId, roomId)) {
            Participant p = viewerService.reentryParticipant(userId, roomId);
            viewerDto = new ViewerDto(p.getUser().getId(),p.getNickName(),p.getUser().getColorItem().getRgb(),p.isHost(),p.getEnterTime());
        } else { //신규 추가
            Participant p = viewerService.firstEntryParticipant(userId, roomId);
            viewerDto = new ViewerDto(p.getUser().getId(),p.getNickName(),p.getUser().getColorItem().getRgb(),p.isHost(),p.getEnterTime());
        }
        //토론방 현재 인원 수 +1
        roomService.incrementRoomCurrentCount(roomId);
        messagingTemplate.convertAndSend("/from/room/enter/" + roomId, viewerDto);
    }

    @MessageMapping("/room/out/{roomId}/{userId}")
    public void exitRoom(@DestinationVariable Long roomId, @DestinationVariable Long userId) {
        ParticipantOutDto participantOutDto = viewerService.exitSocket(userId, roomId);
        participantOutDto.setUserId(userId);
        messagingTemplate.convertAndSend("/from/room/out/" + roomId, participantOutDto);
    }

    @MessageMapping("/room/file/{roomId}")
    public void exitRoom(@DestinationVariable Long roomId, String filepath) {
        messagingTemplate.convertAndSend("/from/room/file/" + roomId, filepath);
    }


}
