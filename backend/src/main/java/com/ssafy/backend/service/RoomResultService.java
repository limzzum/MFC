package com.ssafy.backend.service;

import com.ssafy.backend.dto.Message;
import com.ssafy.backend.dto.MethodResultDto;
import com.ssafy.backend.dto.request.RoomInfoRuquestDto;
import com.ssafy.backend.dto.response.*;
import com.ssafy.backend.entity.*;
import com.ssafy.backend.repository.CategoryCodeRepository;
import com.ssafy.backend.repository.HistoryRepository;
import com.ssafy.backend.repository.ParticipantRepository;
import com.ssafy.backend.repository.PlayerRepository;
import com.ssafy.backend.repository.RoleCodeRepository;
import com.ssafy.backend.repository.RoomRepository;
import com.ssafy.backend.repository.UserRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.aspectj.bridge.IMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Transactional
@RequiredArgsConstructor
@Service
public class RoomResultService {

  private final RoomRepository roomRepository;
  private final PlayerRepository playerRepository;
  private final ParticipantRepository participantRepository;
  private final HistoryRepository historyRepository;
  private static final int MAX_LIFE_GAUGE = 100;
  private static final int WIN_PLAYER_EXP = 5;
  private static final int DRAW_PLAYER_EXP = 3;
  private static final int LOSE_PLAYER_EXP = 5;
  private static final float WIN_PLAYER_COIN = 1.5f;
  private static final int DRAW_LOSE_PLAYER_COIN = 1;
  private static final int PLAYER_OUT_POINT = 5;


  public Message roomReset(Long roomId) {
    Room room = roomRepository.findById(roomId).orElse(null);
    Message message = new Message();
    if (room == null) {
      message.setStatus(HttpStatus.BAD_REQUEST);
      message.setMessage("해당 방을 찾을 수 없습니다.");
    } else {
      room.setStartTime(null);
      roomRepository.save(room);
      message.setStatus(HttpStatus.OK);
    }
    return message;
  }

  // 종료 결과
  // 1. 시간 종료, 생명게이지 0 => roomId, userId => 플레이어라면 전적 증가 => socket 필요 없음
  // 2. 플레이어 항복 => roomId, userId => 해당 플레이어 lose => 토론 결과 ( 전적 수정 - 메서드 따로  ) => 토론 결과 socket 전송
  // 3. 플레이어 나가기 => roomId, userId => 해당 플레이어 lose => 토론 결과 ( 전적 수정 ), +  ( 패널티 부과 ) => 토론 결과 seocket 전송
  // 3.1 이후 플레이어 상태 변경 api 프론트에서 서버로 전송하기

  // 시간초과나 생명게이지 감소로 API보내는 경우 플레이어가 아닌 관전자일 경우
  public MethodResultDto roomResult(Boolean isSurrender, Boolean isExit, Long userId,Long roomId) {
    MethodResultDto methodResultDto = new MethodResultDto();
    DebateFinInfoDto debateFinInfoDto;

    Room room = roomRepository.findById(roomId).orElse(null);
    if (room == null) {
      methodResultDto.setResult(false);
      methodResultDto.setMessage("해당 방을 찾을 수 없습니다.");
    } else {
      room.setStatus(Status.DONE);
      roomRepository.save(room);
      List<Participant> participants = participantRepository.findAllByRoomId(roomId);
      List<Participant> players = new ArrayList<>();

      for (Participant p : participants) {
        if (p.getRoleCode().getId() == 2) {
          players.add(p);
        }
      }

      List<Player> playerEntities = new ArrayList<>();
      for (Participant player : players) {
        Player playerEntity = playerRepository.findTopByRoomIdAndUserId(roomId, player.getUser().getId()).orElse(null);
        if (playerEntity != null) {
          playerEntities.add(playerEntity);
        }
      }

      Player playerA = null;
      Player playerB = null;

      for (Player p : playerEntities) {
        if (p.isTopicTypeA()) {
          playerA = p;
        } else {
          playerB = p;
        }
      }

      int bVoteCount = (int) participants.stream()
              .filter(p -> Boolean.FALSE.equals(p.getIsVoteTypeA()))
              .count();

      int aVoteCount = (int) participants.stream()
              .filter(p -> Boolean.TRUE.equals(p.getIsVoteTypeA()))
              .count();

      DebateFinPlayerDto playerADto = new DebateFinPlayerDto(aVoteCount, playerA.getHeartPoint());
      DebateFinPlayerDto playerBDto = new DebateFinPlayerDto(bVoteCount, playerB.getHeartPoint());

      if(isSurrender || isExit) {
        if(playerA.getUser().getId() == userId) {
          if(isSurrender) {
            playerADto = playerHistoryGet(playerADto, playerA.getUser().getId(),"lose");
            playerHistoryUpdate(playerADto, playerA.getUser().getId(),"lose");
          } else if(isExit) {
            playerADto = playerHistoryGet(playerADto, playerA.getUser().getId(),"out");
            playerHistoryUpdate(playerADto, playerA.getUser().getId(),"out");
          }
          playerBDto = playerHistoryGet(playerBDto, playerB.getUser().getId(),"win");
          playerHistoryUpdate(playerBDto, playerB.getUser().getId(),"win");
          debateFinInfoDto = new DebateFinInfoDto(playerB.getUser().getProfile(),playerB.getUser().getNickname(),playerADto,playerBDto,isSurrender,isExit);
        }else  {
          if(isSurrender) {
            playerBDto = playerHistoryGet(playerBDto, playerB.getUser().getId(),"lose");
            playerHistoryUpdate(playerBDto, playerB.getUser().getId(),"lose");
          } else if(isExit) {
            playerBDto = playerHistoryGet(playerBDto, playerB.getUser().getId(),"out");
            playerHistoryUpdate(playerBDto, playerB.getUser().getId(),"out");
          }
          playerADto = playerHistoryGet(playerADto, playerA.getUser().getId(),"win");
          playerHistoryUpdate(playerADto, playerA.getUser().getId(),"win");
          debateFinInfoDto = new DebateFinInfoDto(playerA.getUser().getProfile(),playerA.getUser().getNickname(),playerADto,playerBDto,isSurrender,isExit);
        }
        methodResultDto.setResult(true);
        methodResultDto.setData(debateFinInfoDto);
      }else {
        String isPlayerAStatus = isPlayerAwin(aVoteCount,bVoteCount,playerA.getHeartPoint(),playerB.getHeartPoint());
        if(isPlayerAStatus == "win") {
          playerADto = playerHistoryGet(playerADto, playerA.getUser().getId(),"win");
          playerBDto = playerHistoryGet(playerBDto, playerB.getUser().getId(),"lose");
          if(playerA.getUser().getId() == userId) {
            playerHistoryUpdate(playerADto, playerA.getUser().getId(),"win");
          }else if(playerB.getUser().getId() == userId){
            playerHistoryUpdate(playerBDto, playerB.getUser().getId(),"lose");
          }
          debateFinInfoDto = new DebateFinInfoDto(playerA.getUser().getProfile(),playerA.getUser().getNickname(),playerADto,playerBDto,isSurrender,isExit);
        }else if(isPlayerAStatus == "draw") {
          playerADto = playerHistoryGet(playerADto, playerA.getUser().getId(),"draw");
          playerBDto = playerHistoryGet(playerBDto, playerB.getUser().getId(),"draw");
          if(playerA.getUser().getId() == userId) {
            playerHistoryUpdate(playerADto, playerA.getUser().getId(),"draw");
          }else if(playerB.getUser().getId() == userId){
            playerHistoryUpdate(playerBDto, playerB.getUser().getId(),"draw");
          }
          debateFinInfoDto = new DebateFinInfoDto(playerADto,playerBDto,isSurrender,isExit);
        }else {
          playerADto = playerHistoryGet(playerADto, playerA.getUser().getId(),"lose");
          playerBDto = playerHistoryGet(playerBDto, playerB.getUser().getId(),"win");
          if(playerA.getUser().getId() == userId) {
            playerHistoryUpdate(playerADto, playerA.getUser().getId(),"lose");
          }else if(playerB.getUser().getId() == userId){
            playerHistoryUpdate(playerBDto, playerB.getUser().getId(),"win");
          }
          debateFinInfoDto = new DebateFinInfoDto(playerB.getUser().getProfile(),playerB.getUser().getNickname(),playerADto,playerBDto,isSurrender,isExit);
        }

        methodResultDto.setResult(true);
        methodResultDto.setData(debateFinInfoDto);
      }
    }
    return methodResultDto;
  }
  public DebateFinPlayerDto playerHistoryGet(DebateFinPlayerDto playerDto,Long userId,String status) {
    History orgHistory = historyRepository.findHistoryByUserId(userId);
    int getCoin = 0;
    int getExp = 0;
    int totalCoin = 0;
    int totalExp = 0;
    if(orgHistory != null) {
      if (status == "win") {
        getExp = WIN_PLAYER_EXP;
        getCoin = Math.round(playerDto.getHp() * WIN_PLAYER_COIN);
      } else if (status == "draw") {
        getExp = DRAW_PLAYER_EXP;
        getCoin = playerDto.getHp() * DRAW_LOSE_PLAYER_COIN;
      } else {
        if (status == "out") { // 나간 플레이어에게 coin 부과..?
          getExp = -PLAYER_OUT_POINT;
        } else {
          getExp = LOSE_PLAYER_EXP;
        }
        getCoin = playerDto.getHp() * DRAW_LOSE_PLAYER_COIN;
      }
    }
    totalExp = orgHistory.getExperience() + getExp;
    totalCoin = orgHistory.getCoin() + getCoin;
    playerDto.insertDto(totalCoin,getCoin, totalExp, getExp);
    return playerDto;
  }
  public void playerHistoryUpdate(DebateFinPlayerDto playerDto,Long userId,String status) {
    History orgHistory = historyRepository.findHistoryByUserId(userId);
    orgHistory.setCoin(playerDto.getCoin());
    orgHistory.setExperience(playerDto.getExp());
    if(status == "win") {
      orgHistory.setWinCount(orgHistory.getWinCount() + 1);
    }else if(status == "lose"){
      orgHistory.setLoseCount(orgHistory.getLoseCount() + 1);
    }else {
      orgHistory.setDrawCount(orgHistory.getDrawCount() + 1);
    }
    historyRepository.save(orgHistory);
  }
  public String isPlayerAwin (int playerAVoteCount, int playerBVoteCount, int playerAHpCount, int playerBHpCount){
    String playerAResult = "";

    int totalVoteCount = playerAVoteCount + playerBVoteCount;

    if (playerAHpCount == 0) {
      playerAResult = "lose";
    } else if (playerBHpCount == 0) {
      playerAResult = "win";
    } else if (totalVoteCount == 0) {
      if (playerAHpCount > playerBHpCount) {
        playerAResult = "win";
      } else if (playerAHpCount < playerBHpCount) {
        playerAResult = "lose";
      } else {
        playerAResult = "draw";
      }
    } else {
      double playerAHpRate = (double) playerAHpCount / MAX_LIFE_GAUGE;
      double playerBHpRate = (double) playerBHpCount / MAX_LIFE_GAUGE;

      double playerAVoteRate = (double) playerAVoteCount / totalVoteCount;
      double playerBVoteRate = (double) playerBVoteCount / totalVoteCount;

      double finalPlayerAWinRate = (playerAHpRate * 0.5) + (playerAVoteRate * 0.5);
      double finalPlayerBWinRate = (playerBHpRate * 0.5) + (playerBVoteRate * 0.5);

      if (finalPlayerAWinRate > finalPlayerBWinRate) {
        playerAResult = "win";
      } else if (finalPlayerAWinRate < finalPlayerBWinRate) {
        playerAResult = "lose";
      } else {
        playerAResult = "draw";
      }
    }
    return playerAResult;
  }
}
