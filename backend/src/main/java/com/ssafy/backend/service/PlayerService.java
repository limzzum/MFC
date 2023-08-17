package com.ssafy.backend.service;

import com.ssafy.backend.dto.request.*;
import com.ssafy.backend.dto.socket.request.*;
import com.ssafy.backend.dto.socket.response.PlayerStatusDto;
import com.ssafy.backend.dto.socket.response.RoomStatusDto;
import com.ssafy.backend.entity.*;
import com.ssafy.backend.repository.PlayerRepository;
import com.ssafy.backend.repository.RoleCodeRepository;
import com.ssafy.backend.repository.RoomRepository;
import com.ssafy.backend.util.RedisUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final RoomRepository roomRepository;
    private final ParticipantService participantService;
    private final RoleCodeRepository roleCodeRepository;
    private final RedisUtil redisUtil;

    public Player getPlayer(Long roomId, Long userId){
        Player player = playerRepository.findTopByRoomIdAndUserId(roomId, userId).orElse(null);
        return player;
    }

    public Long regist(PlayerRegistDto playerRegistDto){
        User user = new User(playerRegistDto.getUserId());
        Room room = roomRepository.findById(playerRegistDto.getRoomId()).orElse(null);
        if(room == null){
            System.out.println("room  null");
            return null;
        }
        Player curPlayer = playerRepository.findFirstByRoomIdAndIsTopicTypeA(playerRegistDto.getRoomId(), playerRegistDto.isATopic()).orElse(null);
        if(curPlayer != null){
            System.out.println("curPlayer 존재");
            return null;
        }
        Player existPlayer = playerRepository.findTopByRoomIdAndUserId(playerRegistDto.getRoomId(), playerRegistDto.getUserId()).orElse(null);
        if(existPlayer != null){
            existPlayer.changeTopic(playerRegistDto.isATopic());
            System.out.println(existPlayer.getId());
            return existPlayer.getId();
        }
        Player player = Player.builder().room(room).user(user).remainOverTimeCount(room.getOverTimeCount()).isTopicTypeA(playerRegistDto.isATopic()).build();
        Player save = playerRepository.save(player);
        participantService.changeRole(playerRegistDto,roleCodeRepository.findById(2L).get());
        return save.getId();
    }

    public boolean changeStatus(PlayerDto playerDto, boolean status){
        Player player = playerRepository.findTopByRoomIdAndUserId(playerDto.getRoomId(), playerDto.getUserId()).orElse(null);
        player.changeStatus(status);
        if(status){
            List<Player> allByRoomId = playerRepository.findAllByRoomId(playerDto.getRoomId());
            for (Player roomPlayer : allByRoomId) {
                if(!roomPlayer.isReady()){
                    return false;
                }
            }
            return true;
        }
        return false;

    }

    public void modify(PlayerUpdateDto playerUpdateDto){
        Player player = playerRepository.findTopByRoomIdAndUserId(playerUpdateDto.getRoomId(), playerUpdateDto.getUserId()).orElse(null);
        if(player == null){
            return;
        }
        player.updateInfo(playerUpdateDto);
    }

    public void deletePlayer(PlayerRegistDto playerRegistDto){
        playerRepository.deleteByRoomIdAndUserId(playerRegistDto.getRoomId(),playerRegistDto.getUserId());
        participantService.changeRole(playerRegistDto,roleCodeRepository.findById(3L).get());
    }

    public boolean overTalk(PlayerDto playerDto){
        Player player = playerRepository.findTopByRoomIdAndUserId(playerDto.getRoomId(), playerDto.getUserId()).orElse(null);
        if(player == null){
            return false;
        }

        boolean result = player.removeOverTimeCnt();
        if(result){
            return true;
        }
        return false;
    }
    public int getRemainOverTimeCnt(PlayerDto playerDto){
        Player player = playerRepository.findTopByRoomIdAndUserId(playerDto.getRoomId(), playerDto.getUserId()).orElse(null);
        if(player == null){
            return 0;
        }
        int remainCnt = player.getRemainOverTimeCount();
        return remainCnt;
    }
    public boolean isAllReady(Long roomId){
        List<Player> allByRoomId = playerRepository.findAllByRoomId(roomId);
        for (Player player : allByRoomId) {
            if(!player.isReady()){
                return false;
            }
        }
        return true;
    }

    public PlayerStatusDto updatePlayerHp(PlayerPlusHpDto playerPlusHpDto){
        RoomStatusDto roomStatus = redisUtil.getRoomStatus(String.valueOf(playerPlusHpDto.getRoomId()));
        Room room = roomRepository.findById(playerPlusHpDto.getRoomId()).orElse(null);
        boolean aTopic = playerPlusHpDto.isATopic();
        int hpPointA = roomStatus.getHpPointA();
        int hpPointB = roomStatus.getHpPointB();

        PlayerStatusDto playerStatusDto;
        if(aTopic){
            hpPointA += playerPlusHpDto.getHp(); //getHp()는 감소할 페널티 점수임
            playerStatusDto = PlayerStatusDto.builder().userId(playerPlusHpDto.getUserId())
                    .isATopic(playerPlusHpDto.isATopic()).hp(hpPointA).build();
        }else{
            hpPointB += playerPlusHpDto.getHp(); //getHp()는 감소할 페널티 점수임
            playerStatusDto = PlayerStatusDto.builder().userId(playerPlusHpDto.getUserId())
                    .isATopic(playerPlusHpDto.isATopic()).hp(hpPointB).build();
        }
        redisUtil.setRoomStatusTemplate(String.valueOf(playerPlusHpDto.getRoomId()), RoomStatusDto.builder()
                .curUserId(roomStatus.getCurUserId())
                .hpPointA(hpPointA)
                .hpPointB(hpPointB)
                .isATurn(roomStatus.isATurn())
                .roomImagePath(roomStatus.getRoomImagePath())
                .startTalkTime(roomStatus.getStartTalkTime()).build()
                ,room.getTotalTime());
        return playerStatusDto;
    }

    public int getPlayerHp(Long roomId, boolean isATpoic ){
        RoomStatusDto roomStatus = redisUtil.getRoomStatus(String.valueOf(roomId));
        if(isATpoic){
            return roomStatus.getHpPointA();
        }
        return roomStatus.getHpPointB();
    }

    public void changePlayerTurn(PlayerTurnChangeDto playerTurnChangeDto){
        RoomStatusDto roomStatus = redisUtil.getRoomStatus(String.valueOf(playerTurnChangeDto.getRoomId()));
        redisUtil.setRoomStatusTemplate(String.valueOf(playerTurnChangeDto.getRoomId()), RoomStatusDto.builder()
                .curUserId(roomStatus.getCurUserId()).hpPointA(roomStatus.getHpPointA()).hpPointB(roomStatus.getHpPointB())
                .isATurn(playerTurnChangeDto.isATurn()).roomImagePath(roomStatus.getRoomImagePath())
                .startTalkTime(LocalDateTime.now()).build(), 200);
    }

    public LocalDateTime plusPlayerTalkTime(PlayerPlusTimeDto playerPlusTimeDto){
        RoomStatusDto roomStatus = redisUtil.getRoomStatus(String.valueOf(playerPlusTimeDto.getRoomId()));
        LocalDateTime updateStartTime = roomStatus.getStartTalkTime().plusSeconds(playerPlusTimeDto.getPlusTime());
        redisUtil.setRoomStatusTemplate(String.valueOf(playerPlusTimeDto.getRoomId()), RoomStatusDto.builder()
                .curUserId(roomStatus.getCurUserId()).hpPointA(roomStatus.getHpPointA()).hpPointB(roomStatus.getHpPointB())
                .isATurn(roomStatus.isATurn()).roomImagePath(roomStatus.getRoomImagePath())
                .startTalkTime(updateStartTime).build(), 200);
        return updateStartTime;
    }








}
