package com.ssafy.backend.service;

import com.ssafy.backend.dto.Message;
import com.ssafy.backend.dto.request.RoomInfoRuquestDto;
import com.ssafy.backend.dto.response.RoomFinToParticipantDto;
import com.ssafy.backend.dto.response.RoomFinToPlayerDto;
import com.ssafy.backend.dto.response.RoomInfoResponseDto;
import com.ssafy.backend.dto.response.RoomListDto;
import com.ssafy.backend.entity.CategoryCode;
import com.ssafy.backend.entity.Participant;
import com.ssafy.backend.entity.Player;
import com.ssafy.backend.entity.RoleCode;
import com.ssafy.backend.entity.Room;
import com.ssafy.backend.entity.Status;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.CategoryCodeRepository;
import com.ssafy.backend.repository.HistoryRepository;
import com.ssafy.backend.repository.ParticipantRepository;
import com.ssafy.backend.repository.PlayerRepository;
import com.ssafy.backend.repository.RoleCodeRepository;
import com.ssafy.backend.repository.RoomRepository;
import com.ssafy.backend.repository.UserRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
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
  private static final int MAX_LIFE_GAUGE = 100;

  public Message roomReset(Long roomId) {
    Room room = roomRepository.findById(roomId).orElse(null);
    Message message = new Message();
    if(room == null) {
      message.setStatus(HttpStatus.BAD_REQUEST);
      message.setMessage("해당 방을 찾을 수 없습니다.");
    }else {
      room.setStartTime(null);
      roomRepository.save(room);
      message.setStatus(HttpStatus.OK);
    }
    return message;
  }

  public Message roomResult(Long userId, Long roomId) {
    Message message = new Message();
    Room room = roomRepository.findById(roomId).orElse(null);
    room.setStatus(Status.WAITING);
    roomRepository.save(room);
    Participant participant = participantRepository.findAllByUserIdAndRoomId(userId, roomId);
    if (participant != null) {
      if (participant.getRoleCode().getId() == 1) {
        message.setStatus(HttpStatus.BAD_REQUEST);
        message.setMessage("토론방에서 나간 유저입니다.");
      } else {
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

        int totalVoteCount = (int) participants.stream()
                .filter(p -> p.getIsVoteTypeA() != null)
                .count();

        int aVoteCount = (int) participants.stream()
                .filter(p -> Boolean.TRUE.equals(p.getIsVoteTypeA()))
                .count();

        String aResult = "";
        String bResult = "";

        if (playerA.getHeartPoint() == 0) {
          bResult = "win";
          aResult = "lose";
        } else if (playerB.getHeartPoint() == 0) {
          aResult = "win";
          bResult = "lose";
        } else if (totalVoteCount == 0) {
          if (playerA.getHeartPoint() > playerB.getHeartPoint()) {
            aResult = "win";
            bResult = "lose";
          } else if (playerA.getHeartPoint() < playerB.getHeartPoint()) {
            bResult = "win";
            aResult = "lose";
          } else {
            aResult = "draw";
            bResult = "draw";
          }
        } else {
          double playerAHpRate = (double) playerA.getHeartPoint() / MAX_LIFE_GAUGE;
          double playerBHpRate = (double) playerB.getHeartPoint() / MAX_LIFE_GAUGE;

          double playerAVoteRate = (double) aVoteCount / totalVoteCount;
          double playerBVoteRate = (double) ((totalVoteCount - aVoteCount) / totalVoteCount);

          double finalPlayerAWinRate = (playerAHpRate * 0.5) + (playerAVoteRate * 0.5);
          double finalPlayerBWinRate = (playerBHpRate * 0.5) + (playerBVoteRate * 0.5);

          System.out.println(finalPlayerAWinRate);
          System.out.println(finalPlayerBWinRate);

          if (finalPlayerAWinRate > finalPlayerBWinRate) {
            aResult = "win";
            bResult = "lose";
          } else if (finalPlayerAWinRate < finalPlayerBWinRate) {
            bResult = "win";
            aResult = "lose";
          } else {
            aResult = "draw";
            bResult = "draw";
          }
        }

        if (participant.getRoleCode().getId() == 2) { // 관전자 없는 경우도 체크해줘야 함...
          int playerVoteCount = aVoteCount;
          String result = "";
          int exp = 0;
          int hp = 0;
          int coin = 0;
          if (playerB.getUser().getId() == userId) {
            playerVoteCount = totalVoteCount - aVoteCount;
            result = bResult;
            exp = getexp(aResult, bResult, "b");
            hp = playerB.getHeartPoint();
            coin = getcoin(result, hp);
          } else {
            result = aResult;
            exp = getexp(aResult, bResult, "a");
            hp = playerA.getHeartPoint();
            coin = getcoin(result, hp);
          }
          RoomFinToPlayerDto roomFinToPlayerDto = RoomFinToPlayerDto.builder()
                  .result(result)
                  .userVoteCount(playerVoteCount)
                  .voteTotal(totalVoteCount)
                  .userGetCoin(coin)
                  .userGetExp(exp)
                  .hp(hp)
                  .build();
          message.setStatus(HttpStatus.OK);
          message.setMessage("플레이어에게 토론 결과 보내기 성공");
          message.setData(roomFinToPlayerDto);
          return message;
        } else {
          RoomFinToParticipantDto roomFinToParticipantDto = RoomFinToParticipantDto.builder()
//                  .aTopic(participant.getRoom().getATopic())
//                  .bTopic(participant.getRoom().getBTopic())
                  .aResult(aResult)
                  .bResult(bResult)
                  .aVoteCount(aVoteCount)
                  .bVoteCount(totalVoteCount - aVoteCount)
                  .aHp(playerA.getHeartPoint())
                  .bHp(playerB.getHeartPoint())
                  .build();
          message.setStatus(HttpStatus.OK);
          message.setMessage("관전자에게 토론 결과 보내기 성공");
          message.setData(roomFinToParticipantDto);
          return message;
        }
      }
    }else {
        message.setStatus(HttpStatus.BAD_REQUEST);
        message.setMessage("토론방에서 해당 유저를 조회할 수 없습니다.");
      }
    return message;
    }

  public int getexp(String aResult,String bResult,String p) {
    if(aResult == "win" && bResult == "lose" && p == "a") {
      return 5;
    }else if(aResult == "lose" && bResult == "win" && p == "a") {
      return 1;
    }else if(aResult == "win" && bResult == "lose" && p == "b") {
      return 1;
    }else if(aResult == "lose" && bResult == "win" && p == "b"){
      return 5;
    }else {
      return 3;
    }
  }

  public int getcoin(String result,int hp) {
    if(result == "win") {
      return hp + hp / 2;
    }else {
      return hp;
    }
  }

}
