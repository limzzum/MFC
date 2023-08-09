package com.ssafy.backend.controller;

import com.ssafy.backend.dto.common.ChatMessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
//@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ChatController {

  private final SimpMessagingTemplate messagingTemplate;

  @MessageMapping("/chat")
  public void sendMessage(ChatMessageDto chatMessageDto) {
    Long roomId = chatMessageDto.getRoomId();
    messagingTemplate.convertAndSend("/from/chat/" + roomId, chatMessageDto);
  }

}
