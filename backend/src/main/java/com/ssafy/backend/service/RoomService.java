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
public class RoomService {

  private final RoomRepository roomRepository;
  private final PlayerRepository playerRepository;
  private final CategoryCodeRepository categoryCodeRepository;
  private final ParticipantRepository participantRepository;
  private final UserRepository userRepository;
  private final RoleCodeRepository roleCodeRepository;
  private final HistoryRepository historyRepository;
  private static final int MAX_LIFE_GAUGE = 100;

  public List<RoomListDto> ongoingRoomList(Long minRoomId, int size) {
    Pageable pageable = PageRequest.of(0, size);
    Page<Room> ongoingRooms = roomRepository.findByIdLessThanAndStatusOrderByIdDesc(minRoomId,
        Status.ONGOING, pageable);

    List<RoomListDto> rooms;
    if (ongoingRooms != null) {
      rooms = ongoingRooms.stream()
          .map(this::convertToRoomListDto)
          .collect(Collectors.toList());
    } else {
      rooms = new ArrayList<>(); // 빈 리스트 반환
    }
    return rooms;
  }

  public List<RoomListDto> waitingRoomList(Long minRoomId, int size) {
    Pageable pageable = PageRequest.of(0, size);
    Page<Room> ongoingRooms = roomRepository.findByIdLessThanAndStatusOrderByIdDesc(minRoomId,
        Status.WAITING, pageable);

    List<RoomListDto> rooms = ongoingRooms.stream()
        .map(this::convertToRoomListDto)
        .collect(Collectors.toList());
    return rooms;
  }

  public List<RoomListDto> searchRoomsByKeyword(String keyword, Long minRoomId, int size) {
    List<Room> rooms = roomRepository.searchRoomsByKeyword(keyword, minRoomId,
        PageRequest.of(0, size));
    return rooms.stream()
        .map(this::convertToRoomListDto)
        .collect(Collectors.toList());
  }

  private RoomListDto convertToRoomListDto(Room room) {
    // 여기서 각 토론방의 플레이어 정보를 가져와서 프로필 사진 URL 설정
    // 플레이어 repository에서 a토픽, b토픽 유저의 url 가져오기...

    List<Player> players = playerRepository.findAllByRoomId(room.getId());

    Player playerA = players.stream()
        .filter(Player::isTopicTypeA)
        .findFirst()
        .orElse(null);

    Player playerB = players.stream()
        .filter(player -> !player.isTopicTypeA())
        .findFirst()
        .orElse(null);

    String aTopicUserUrladdress = null;
    String bTopicUserUrladdress = null;

    RoomListDto.Status roomStatus;
    if (room.getStatus() == Status.ONGOING) {
      roomStatus = RoomListDto.Status.ONGOING;
    } else if (room.getStatus() == Status.DONE) {
      roomStatus = RoomListDto.Status.DONE;
    } else {
      roomStatus = RoomListDto.Status.WAITING;
    }

    if (playerA != null && playerA.getUser() != null && playerA.getUser().getProfile() != null) {
      aTopicUserUrladdress = playerA.getUser().getProfile();
    }

    if (playerB != null && playerB.getUser() != null && playerB.getUser().getProfile() != null) {
      bTopicUserUrladdress = playerB.getUser().getProfile();
    }

    // RoomListDto 객체 생성 후 프로필 사진 URL 설정
    return RoomListDto.builder()
        .roomId(room.getId())
        .totalTime(room.getTotalTime())
        .talkTime(room.getTalkTime())
        .maxPeople(room.getMaxPeople())
        .curPeople(room.getCurPeople())
        .overtimeCount(room.getOverTimeCount())
        .status(roomStatus)
        .aTopic(room.getATopic())
        .bTopic(room.getBTopic())
        .startTime(room.getStartTime())
        .aTopicUserUrl(aTopicUserUrladdress) // 플레이어 A의 프로필 사진 URL
        .bTopicUserUrl(bTopicUserUrladdress) // 플레이어 B의 프로필 사진 URL
        .categoryId(room.getCategoryCode().getId())
        .build();
  }

  public Long createRoom(Long userId, RoomInfoRuquestDto roomInfoRuquestDto) {
    CategoryCode categoryCode = categoryCodeRepository.findById(1L).orElse(null);
    Room room = Room.builder()
        .totalTime(roomInfoRuquestDto.getTotalTime())
        .talkTime(roomInfoRuquestDto.getTalkTime())
        .maxPeople(roomInfoRuquestDto.getMaxPeople())
        .overTimeCount(roomInfoRuquestDto.getOverTimeCount())
        .aTopic(roomInfoRuquestDto.getATopic())
        .bTopic(roomInfoRuquestDto.getBTopic())
        .status(Status.WAITING)
        .categoryCode(categoryCode)
        .build();
    User user = userRepository.findById(userId).orElse(null);
    RoleCode roleCode = roleCodeRepository.findById(3L).orElse(null);
    // user 예외처리하기
    Participant participant = Participant.builder()
        .nickName(user.getNickname())
        .isHost(true)
        .user(user)
        .room(room)
        .roleCode(roleCode)
        .build();

    roomRepository.save(room);
    participantRepository.save(participant);
    return room.getId();
  }


  public RoomInfoResponseDto updateRoom(Long roomId, RoomInfoRuquestDto roomInfoRuquestDto) {
    Room existingRoom = roomRepository.findById(roomId).orElse(null);

    if (existingRoom == null) {
      return null;
    }

    existingRoom.setTotalTime(roomInfoRuquestDto.getTotalTime());
    existingRoom.setTalkTime(roomInfoRuquestDto.getTalkTime());
    existingRoom.setMaxPeople(roomInfoRuquestDto.getMaxPeople());
    existingRoom.setOverTimeCount(roomInfoRuquestDto.getOverTimeCount());
    existingRoom.setATopic(roomInfoRuquestDto.getATopic());
    existingRoom.setBTopic(roomInfoRuquestDto.getBTopic());

    RoomInfoResponseDto roomInfoResponseDto = new RoomInfoResponseDto(existingRoom);
    return roomInfoResponseDto;
  }

  public RoomInfoResponseDto getRoomInfoById(Long roomId) {
    Room room = roomRepository.findById(roomId).orElse(null);
    if (room == null) {
      return null;
    }
    return new RoomInfoResponseDto(room);
  }


  public int incrementRoomCurrentCount(Long roomId) {
    Room room = roomRepository.findById(roomId).orElse(null);
    if (room != null) {
      room.setCurPeople(room.getCurPeople() + 1);
      roomRepository.save(room);
    }
    return room.getCurPeople();
  }

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

  public Message roomFin(Long userId, Long roomId) {
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
          Player playerEntity = playerRepository.findTopByRoomIdAndUserId(roomId,
              player.getUser().getId()).orElse(null);
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
              .aTopic(participant.getRoom().getATopic())
              .bTopic(participant.getRoom().getBTopic())
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
    } else {
      message.setStatus(HttpStatus.BAD_REQUEST);
      message.setMessage("토론방에서 해당 유저를 조회할 수 없습니다.");
    }
    return message;
  }

  public int getexp(String aResult, String bResult, String p) {
    if (aResult == "win" && bResult == "lose" && p == "a") {
      return 5;
    } else if (aResult == "lose" && bResult == "win" && p == "a") {
      return 1;
    } else if (aResult == "win" && bResult == "lose" && p == "b") {
      return 1;
    } else if (aResult == "lose" && bResult == "win" && p == "b") {
      return 5;
    } else {
      return 3;
    }
  }

  public int getcoin(String result, int hp) {
    if (result == "win") {
      return hp + hp / 2;
    } else {
      return hp;
    }
  }

}
