package com.ssafy.backend.controller;

import com.ssafy.backend.dto.request.PlayerDto;
import com.ssafy.backend.dto.request.PlayerRegistDto;
import com.ssafy.backend.dto.socket.request.PlayerItemDto;
import com.ssafy.backend.dto.socket.request.PlayerRequestDto;
import com.ssafy.backend.dto.socket.response.ItemFailDto;
import com.ssafy.backend.dto.socket.response.PlayerInfoDto;
import com.ssafy.backend.dto.socket.response.PlayerItemInfoDto;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.service.*;
import lombok.*;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class PlayerSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final PlayerService playerService;
    private final UserService userService;
    private final ItemService itemService;

    @MessageMapping("/player/enter")
    public void setPlayer(PlayerRequestDto playerDto) {
        Long roomId = playerDto.getRoomId();
        User user = userService.findById(playerDto.getUserId());
        playerService.regist(PlayerRegistDto.builder()
                .roomId(roomId)
                .userId(user.getId())
                .isATopic(playerDto.isATopic())
                .build());
        PlayerInfoDto playerInfoDto = PlayerInfoDto.builder()
                .userId(user.getId())
                .nickname(user.getNickname())
                .profile(user.getProfile())
                .colorItem(user.getColorItem())
                .isReady(false)
                .isTopicA(playerDto.isATopic())
                .isAllReady(false).build();
        messagingTemplate.convertAndSend("/from/player/" + roomId, playerInfoDto);
    }

    @MessageMapping("/player/out")
    public void playerOut(PlayerRequestDto playerDto) {
        Long roomId = playerDto.getRoomId();
        User user = userService.findById(playerDto.getUserId());
        playerService.deletePlayer(PlayerRegistDto.builder().roomId(roomId).userId(user.getId()).isATopic(playerDto.isATopic()).build());
        PlayerInfoDto playerInfoDto = PlayerInfoDto.builder().userId(null).nickname(null).profile(null)
            .colorItem(null).isReady(false).isTopicA(playerDto.isATopic()).isAllReady(false).build();
        messagingTemplate.convertAndSend("/from/player/" + roomId, playerInfoDto);
    }

    @MessageMapping("/player/ready")
    public void readyPlayer(PlayerRequestDto playerDto) {
        Long roomId = playerDto.getRoomId();
        User user = userService.findById(playerDto.getUserId());
        playerService.changeStatus(new PlayerDto(roomId,user.getId()), playerDto.isReady());
        boolean allReady = playerService.isAllReady(roomId);
        PlayerInfoDto playerInfoDto = PlayerInfoDto.builder().userId(user.getId()).nickname(user.getNickname()).profile(user.getProfile())
                .colorItem(user.getColorItem()).isReady(playerDto.isReady()).isTopicA(playerDto.isATopic()).isAllReady(allReady).build();
        messagingTemplate.convertAndSend("/from/player/" + roomId, playerInfoDto);
    }



    @MessageMapping("/player/item")
    public void useItem(PlayerItemDto playerDto) {
        Long roomId = playerDto.getRoomId();
        String usedItem = itemService.getUsedItem(playerDto.getUserId(), playerDto.getRoomId(), playerDto.getItemCodeId());

        User user = userService.findById(playerDto.getUserId());
        if(usedItem.equals("아이템 사용 가능")){
            PlayerItemInfoDto playerItemInfoDto = PlayerItemInfoDto.builder().userId(user.getId()).nickname(user.getNickname())
                .isATopic(playerDto.isATopic()).itemCodeId(playerDto.getItemCodeId()).isUsed(true).message(usedItem).build();
            messagingTemplate.convertAndSend("/from/player/item" + roomId,playerItemInfoDto );
        }else {
            PlayerItemInfoDto playerItemInfoDto = PlayerItemInfoDto.builder().userId(user.getId()).nickname(user.getNickname())
                    .isATopic(playerDto.isATopic()).itemCodeId(playerDto.getItemCodeId()).isUsed(false).message(usedItem).build();
            messagingTemplate.convertAndSend("/from/player/item" + roomId,playerItemInfoDto );
        }
    }

}
