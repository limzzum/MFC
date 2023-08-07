package com.ssafy.backend.service;

import com.ssafy.backend.dto.request.*;
import com.ssafy.backend.entity.*;
import com.ssafy.backend.repository.PlayerRepository;
import com.ssafy.backend.repository.RoleCodeRepository;
import com.ssafy.backend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final RoomRepository roomRepository;
    private final ParticipantService participantService;
    private final RoleCodeRepository roleCodeRepository;


    public Long regist(PlayerRegistDto playerRegistDto){
        User user = new User(playerRegistDto.getUserId());
        Room room = roomRepository.findById(playerRegistDto.getRoomId()).orElse(null);
        if(room == null){
            return null;
        }
        Player curPlayer = playerRepository.findFirstByRoomIdAndIsTopicTypeA(playerRegistDto.getRoomId(), playerRegistDto.isATopic()).orElse(null);
        if(curPlayer != null){
            return null;
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




}
