package com.ssafy.backend.service;

import com.ssafy.backend.dto.request.RoomImageUpdateDto;
import com.ssafy.backend.dto.request.RoomInfoRuquestDto;
import com.ssafy.backend.dto.response.RoomInfoResponseDto;
import com.ssafy.backend.dto.response.RoomListDto;
import com.ssafy.backend.dto.socket.response.RoomStatusDto;
import com.ssafy.backend.entity.*;
import com.ssafy.backend.repository.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import com.ssafy.backend.util.RedisUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
  private final UploadFileRepository uploadFileRepository;
  private final HistoryRepository historyRepository;
  private final RedisUtil redisUtil;
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

    String aTopicUserUrladdress = "NONE";
    String bTopicUserUrladdress = "NONE";

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
        .curPeople(1)
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

  public void roomUpdateStatus(Long roomId, Status status) {
    Room room = roomRepository.findById(roomId).orElse(null);
    if (room == null) {
      return;
    }
    room.updateStatus(status);
    roomRepository.save(room);
  }

  public int incrementRoomCurrentCount(Long roomId) {
    Room room = roomRepository.findById(roomId).orElse(null);
    if (room != null) {
      room.setCurPeople(room.getCurPeople() + 1);
      roomRepository.save(room);
    }
    return room.getCurPeople();
  }

  public void fileUpload(UploadFile uploadFile){
    UploadFile saveImage = uploadFileRepository.save(uploadFile);
  }

  public void setRoomStatus(Long roomId){
    Player player = playerRepository.findFirstByRoomIdAndIsTopicTypeA(roomId, true).orElse(null);
    redisUtil.setRoomStatusTemplate(String.valueOf(roomId), RoomStatusDto.builder()
            .curUserId(player.getUser().getId()).hpPointA(100).hpPointB(100).isATurn(true).roomImagePath(null)
            .startTalkTime(LocalDateTime.now()).build(), 200);
  }

  public RoomStatusDto getRoomStatus(Long roomId){
    return redisUtil.getRoomStatus(String.valueOf(roomId));
  }

  public void deleteRoomStatus(Long roomId){
    redisUtil.setRoomStatusTemplate(String.valueOf(roomId), null, 1);
  }

  public void updateRoomImage(RoomImageUpdateDto roomImageUpdateDto){
    RoomStatusDto roomStatus = redisUtil.getRoomStatus(String.valueOf(roomImageUpdateDto.getRoomId()));
    redisUtil.setRoomStatusTemplate(String.valueOf(roomImageUpdateDto.getRoomId()), RoomStatusDto.builder()
            .curUserId(roomStatus.getCurUserId()).hpPointA(roomStatus.getHpPointA()).hpPointB(roomStatus.getHpPointB())
            .isATurn(roomStatus.isATurn()).roomImagePath(roomImageUpdateDto.getRoomImagePath())
            .startTalkTime(roomStatus.getStartTalkTime()).build(), 200);

  }

}
