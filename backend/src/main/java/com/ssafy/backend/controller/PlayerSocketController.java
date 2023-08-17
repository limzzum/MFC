package com.ssafy.backend.controller;

import com.ssafy.backend.dto.request.*;
import com.ssafy.backend.dto.socket.request.PlayerItemDto;
import com.ssafy.backend.dto.socket.request.PlayerRequestDto;
import com.ssafy.backend.dto.socket.response.*;
import com.ssafy.backend.entity.Player;
import com.ssafy.backend.entity.Status;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.PlayerRepository;
import com.ssafy.backend.service.*;
import lombok.*;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.*;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@Transactional
public class PlayerSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final PlayerService playerService;
    private final UserService userService;
    private final ItemService itemService;
    private final RoomService roomService;
    private final PlayerRepository playerRepository;


//    @MessageMapping("/player/enter")
//    public void setPlayer(PlayerRequestDto playerDto) {
//        Long roomId = playerDto.getRoomId();
//        User user = userService.findById(playerDto.getUserId());
//        playerService.regist(PlayerRegistDto.builder()
//                .roomId(roomId)
//                .userId(user.getId())
//                .isATopic(playerDto.isATopic())
//                .build());
//        PlayerInfoDto playerInfoDto = PlayerInfoDto.builder()
//                .userId(user.getId())
//                .nickname(user.getNickname())
//                .profile(user.getProfile())
//                .colorItem(user.getColorItem())
//                .isReady(false)
//                .isATopic(playerDto.isATopic())
//                .isAllReady(false).build();
//        messagingTemplate.convertAndSend("/from/player/enter/" + roomId, playerInfoDto);
//    }

    @MessageMapping("/player/enter")
    public void setPlayer(PlayerRequestDto playerDto) {
        Long roomId = playerDto.getRoomId();
        User user = userService.findById(playerDto.getUserId());
        System.out.println(user.getColorItem().getRgb());
        playerService.regist(PlayerRegistDto.builder()
                .roomId(roomId)
                .userId(user.getId())
                .isATopic(playerDto.isATopic())
                .build());
        PlayerInfoDto playerInfoDto = PlayerInfoDto.builder()
                .userId(user.getId())
                .nickname(user.getNickname())
                .profile(user.getProfile())
                .nickNameColorCode(user.getColorItem().getRgb())
                .isReady(false)
                .isATopic(playerDto.isATopic())
                .isAllReady(false).build();
        messagingTemplate.convertAndSend("/from/player/enter/" + roomId, playerInfoDto);
    }

    @MessageMapping("/player/out")
    public void playerOut(PlayerRequestDto playerDto) {
        Player player = playerRepository.findTopByRoomIdAndUserId(playerDto.getRoomId(), playerDto.getUserId()).orElse(null);
        Long roomId = playerDto.getRoomId();
        playerService.deletePlayer(PlayerRegistDto.builder().roomId(roomId).userId(player.getUser().getId()).isATopic(player.isTopicTypeA()).build());

        PlayerInfoDto playerInfoDto = PlayerInfoDto.builder()
                .userId(player.getUser().getId())
                .nickname(player.getUser().getNickname())
                .profile(player.getUser().getProfile())
                .nickNameColorCode(player.getUser().getColorItem().getRgb())
                .isReady(false)
                .isATopic(player.isTopicTypeA())
                .isAllReady(false).build();

        System.out.println(playerDto.isATopic());
        System.out.println(playerInfoDto.isATopic());
        messagingTemplate.convertAndSend("/from/player/out/" + roomId, playerInfoDto);
    }

//    @MessageMapping("/player/ready")
//    public void readyPlayer(PlayerRequestDto playerDto) {
//        Long roomId = playerDto.getRoomId();
//        User user = userService.findById(playerDto.getUserId());
//        playerService.changeStatus(new PlayerDto(roomId,user.getId()), playerDto.isReady());
//        boolean allReady = playerService.isAllReady(roomId);
//
//        if(allReady){
//            roomService.setRoomStatus(roomId);
//            roomService.roomUpdateStatus(roomId, Status.ONGOING);
//        }
//        PlayerInfoDto playerInfoDto = PlayerInfoDto.builder().userId(user.getId()).nickname(user.getNickname()).profile(user.getProfile())
//                .colorItem(user.getColorItem()).isReady(playerDto.isReady()).isATopic(playerDto.isATopic()).isAllReady(allReady).build();
//        messagingTemplate.convertAndSend("/from/player/ready/" + roomId, playerInfoDto);
//    }

    @MessageMapping("/player/ready")
    public void readyPlayer(PlayerRequestDto playerDto) {
        Long roomId = playerDto.getRoomId();
        User user = userService.findById(playerDto.getUserId());
        boolean allReady = playerService.changeStatus(new PlayerDto(roomId,user.getId()), playerDto.isReady());

        if(allReady){
            roomService.setRoomStatus(roomId);
            roomService.roomUpdateStatus(roomId, Status.ONGOING);
        }
        PlayerInfoDto playerInfoDto = PlayerInfoDto.builder().userId(user.getId()).nickname(user.getNickname()).profile(user.getProfile())
                .nickNameColorCode(user.getColorItem().getRgb()).isReady(playerDto.isReady()).isATopic(playerDto.isATopic()).isAllReady(allReady).build();
        messagingTemplate.convertAndSend("/from/player/ready/" + roomId, playerInfoDto);
    }

    @MessageMapping("/player/item")
    public void useItem(PlayerItemDto playerDto) {
        Long roomId = playerDto.getRoomId();
        Long userId = playerDto.getUserId();
        boolean aTopic = playerDto.isATopic();
        String usedItem = itemService.getUsedItem(playerDto.getUserId(), playerDto.getRoomId(), playerDto.getItemCodeId());

        User user = userService.findById(playerDto.getUserId());
        if(usedItem.equals("아이템 사용 가능")){
            if(playerDto.getItemCodeId() == 9){
                PlayerPlusHpDto playerPlusHpDto = PlayerPlusHpDto.builder().roomId(roomId).userId(userId).isATopic(aTopic).hp(10).build();
                PlayerStatusDto playerStatusDto = playerService.updatePlayerHp(playerPlusHpDto);
                messagingTemplate.convertAndSend("/from/player/status/" + roomId,playerStatusDto );
            }
            PlayerItemInfoDto playerItemInfoDto = PlayerItemInfoDto.builder().userId(user.getId()).nickname(user.getNickname())
                .isATopic(playerDto.isATopic()).itemCodeId(playerDto.getItemCodeId()).isUsed(true).message(usedItem).build();
            messagingTemplate.convertAndSend("/from/player/item/" + roomId,playerItemInfoDto );
        }else {
            PlayerItemInfoDto playerItemInfoDto = PlayerItemInfoDto.builder().userId(user.getId()).nickname(user.getNickname())
                    .isATopic(playerDto.isATopic()).itemCodeId(playerDto.getItemCodeId()).isUsed(false).message(usedItem).build();
            messagingTemplate.convertAndSend("/from/player/item/" + roomId,playerItemInfoDto );
        }
    }


    @MessageMapping("/player/overTalk")
    public void useItem(PlayerRequestDto playerRequestDto) {
        Long roomId = playerRequestDto.getRoomId();
        Long userId = playerRequestDto.getUserId();
        boolean aTopic = playerRequestDto.isATopic();
        boolean isUsed = playerService.overTalk(new PlayerDto(roomId, playerRequestDto.getUserId()));

        if(isUsed) {
            PlayerPlusTimeDto playerPlusTimeDto = PlayerPlusTimeDto.builder().roomId(roomId).curUserId(userId)
                    .isATurn(playerRequestDto.isATopic()).plusTime(10).build();
            LocalDateTime startTalkTime = playerService.plusPlayerTalkTime(playerPlusTimeDto);
            int remainOverTimeCnt = playerService.getRemainOverTimeCnt(new PlayerDto(roomId, userId));
            playerService.updatePlayerHp(PlayerPlusHpDto.builder().roomId(roomId).userId(userId).isATopic(aTopic).hp(-1).build());
            PlayerOverTalkResultDto result = PlayerOverTalkResultDto.builder().userId(userId).isATopic(aTopic).startTalkTime(startTalkTime).remainOverTime(remainOverTimeCnt).isUsed(true).build();
            messagingTemplate.convertAndSend("/from/player/overTalk/" + roomId,result);
            return;
        }
        PlayerOverTalkResultDto result = PlayerOverTalkResultDto.builder().userId(userId).isATopic(aTopic).startTalkTime(null).remainOverTime(0).isUsed(false).build();
        messagingTemplate.convertAndSend("/from/player/overTalk/" + roomId,result);
    }

    @MessageMapping("/player/changeTurn")
    public void turnChange(PlayerTurnChangeDto playerTurnChangeDto) {
        Long roomId = playerTurnChangeDto.getRoomId();
        playerService.changePlayerTurn(playerTurnChangeDto);
        RoomStatusDto roomStatus = roomService.getRoomStatus(roomId);
        messagingTemplate.convertAndSend("/from/room/status/" + roomId,roomStatus);
    }

}
