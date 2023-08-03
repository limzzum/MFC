package com.ssafy.backend.service;

import com.ssafy.backend.entity.Participant;
import com.ssafy.backend.entity.RoleCode;
import com.ssafy.backend.entity.Room;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.ParticipantRepository;
import com.ssafy.backend.repository.RoomRepository;
import com.ssafy.backend.repository.UserRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ViewerService {

  private final ParticipantRepository participantRepository;
  private final UserRepository userRepository;
  private final RoomRepository roomRepository;

  public Participant firstEntryParticipant(Long userId, Long roomId) {
    //방 정보 찾기
    Room room = roomRepository.findById(roomId).get();
    //유저정보 찾기
    User user = userRepository.findById(userId).get();
//    RoleCode roleCode = roleCodeRepository.findById(Long.valueOf(3)).get();
    Participant participant = Participant.builder()
        .nickName(user.getNickname())
        .room(new Room(roomId))
        .user(user)
        .roleCode(new RoleCode(3L, ""))
        .build();
    participantRepository.save(participant);
    return participant;
  }

  public Participant reentryParticipant(Long userId, Long roomId) {
    Participant participant = participantRepository.findAllByUserIdAndRoomId(userId, roomId);
//    RoleCode roleCode = roleCodeRepository.findById(Long.valueOf(3)).get();
    if (participant != null) {
      participant.setNickName(participant.getUser().getNickname());
      participant.setEnterTime(LocalDateTime.now());
      participant.setRoleCode(new RoleCode(3L, ""));
      participantRepository.save(participant);
    }
    return participant;
  }

  public boolean existsUser(Long userId, Long roomId) {
    Participant participant = participantRepository.findAllByUserIdAndRoomId(userId, roomId);
    if (participant == null) {
      return false;
    }
    return true;
  }


}