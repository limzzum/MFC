package com.ssafy.backend.controller;

import com.ssafy.backend.dto.request.*;
import com.ssafy.backend.dto.response.*;
import com.ssafy.backend.service.*;
import lombok.*;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class PlayerSocketController {
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;
    @MessageMapping("/player/enter")
    public void sendMessage(PlayerDto playerDto) {
        Long roomId = playerDto.getRoomId();
        UserInfoDto userInfo = userService.getUserInfo(playerDto.getUserId());
        messagingTemplate.convertAndSend("/from/player/" + roomId, userInfo);
    }

}
