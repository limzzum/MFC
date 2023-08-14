package com.ssafy.backend.controller;

import com.ssafy.backend.dto.common.ChatMessageDto;
import com.ssafy.backend.dto.request.PenaltyRequestDto;
import com.ssafy.backend.dto.request.PlayerPlusHpDto;
import com.ssafy.backend.dto.response.PenaltyDto;
import com.ssafy.backend.dto.socket.response.PlayerStatusDto;
import com.ssafy.backend.entity.Penalty;
import com.ssafy.backend.entity.PenaltyCode;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.service.PenaltyCodeService;
import com.ssafy.backend.service.PenaltyService;
import com.ssafy.backend.service.PlayerService;
import com.ssafy.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
//@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ChatController {

  private final SimpMessagingTemplate messagingTemplate;
  private final PenaltyCodeService penaltyCodeService;
  private final UserService userService;
  private final PenaltyService penaltyService;
  private final PlayerService playerService;

  @MessageMapping("/chat")
  public void sendMessage(ChatMessageDto chatMessageDto) {
    Long roomId = chatMessageDto.getRoomId();
    messagingTemplate.convertAndSend("/from/chat/" + roomId, chatMessageDto);
  }

  @MessageMapping("/chat/penalty")
  public void penalty(PenaltyRequestDto penaltyRequestDto) {
    Long roomId = penaltyRequestDto.getRoomId();
    PenaltyCode penaltyCode = penaltyCodeService.findByCode(penaltyRequestDto.getPenaltyCodeId());
    User user = userService.findById(penaltyRequestDto.getUserId());

    Penalty penalty = penaltyService.save(Penalty.builder().penaltyCode(penaltyCode).user(user).build());
    PenaltyDto result = PenaltyDto.builder().id(penalty.getId()).penaltyTime(penalty.getPenaltyTime()).penaltyCode(penaltyCode.getId()).penaltyName(penaltyCode.getName()).points(penaltyCode.getPoints())
            .userId(penaltyRequestDto.getUserId()).userName(user.getNickname()).build();

    PlayerStatusDto playerStatusDto = playerService.updatePlayerHp(PlayerPlusHpDto.builder().roomId(roomId).userId(user.getId())
            .isATopic(penaltyRequestDto.isATopic()).hp(penaltyCode.getPoints()).build());
    messagingTemplate.convertAndSend("/from/player/status" + roomId, playerStatusDto);
    messagingTemplate.convertAndSend("/from/chat/penalty" + roomId, result);
  }
}
