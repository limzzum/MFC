package com.ssafy.backend.service;

import com.ssafy.backend.dto.MethodResultDto;
import com.ssafy.backend.dto.response.*;
import com.ssafy.backend.entity.Participant;
import com.ssafy.backend.entity.Player;
import com.ssafy.backend.entity.RoleCode;
import com.ssafy.backend.entity.Room;
import com.ssafy.backend.entity.Status;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.ParticipantRepository;
import com.ssafy.backend.repository.PlayerRepository;
import com.ssafy.backend.repository.RoomRepository;
import com.ssafy.backend.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ViewerService {

  private final ParticipantRepository participantRepository;
  private final UserRepository userRepository;
  private final RoomRepository roomRepository;
  private final PlayerRepository playerRepository;

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


  /*
   * 플레이어를 제외한 참여자의 투표 결과를 출력
   * */
  public voteResultDto voteResult(Long roomId) {
    return new voteResultDto(
        participantRepository.countByIsVoteTypeAAndRoomIdAndRoleCodeIdNot(true, roomId, 2L),
        participantRepository.countByIsVoteTypeAAndRoomIdAndRoleCodeIdNot(false, roomId, 2L)
    );
  }

  public boolean vote(Long userId, Long roomId, String result) {
    boolean isSelectedA = result.equals("A") ? true : false;
    Participant participant = participantRepository.findAllByUserIdAndRoomId(userId, roomId);

    if (participant != null) {
      if (participant.getVoteTime() == null) {
        participant.setVoteTime(LocalDateTime.now());
        participant.setIsVoteTypeA(isSelectedA);
      } else {
        Room room = roomRepository.findById(roomId).get();
        LocalDateTime newDateTime = participant.getVoteTime().plusMinutes(room.getTalkTime() * 2);
        LocalDateTime nowDateTime = LocalDateTime.now();
        if (nowDateTime.compareTo(newDateTime) > 0) { //마지막 투표 시간이 발언시간 *2가 넘은 경우
          participant.setVoteTime(LocalDateTime.now());
          participant.setIsVoteTypeA(isSelectedA);
        } else {
          return false;
        }
      }
      participantRepository.save(participant);
    }
    return true;
  }

  public MethodResultDto getNextHost(Long roomId) {
    Participant participant = participantRepository.findTop1ByRoomIdAndRoleCodeIdNotAndIsHostOrderByEnterTimeAsc(
        roomId, 1L, false);

    MethodResultDto result = new MethodResultDto();
    if (participant == null) {
      result.setResult(false);
      result.setData("방장 권한을 받을 수 있는 사용자가 없습니다");
    } else {
      result.setData(participant);
    }
    return result;
  }

  public MethodResultDto exit(Long userId, Long roomId) {
    /*
     * 나가려는 사람이  플레이어인 경우
     * 플레이어 목록에서 ID 삭제 후 아래와 같이 동작
     *
     * 해당 사용자의 롤을 퇴장자로 변경한다
     * 토론방의 현재인원을 차감 시킨다
     * 해당 인원이 해당 토론방의 마지막 사람인 경우(현재인원이 0가 되면) 토론방의 상태를 DONE으로 변경한다
     * 방장인 경우 가장 방장이 아닌 사람 중 가장 빨리 입장한 사람에게 방장 권한을 부여한다.
     *
     * */

    Participant participant = participantRepository.findAllByUserIdAndRoomId(userId, roomId);
    if (participant == null) {
      return new MethodResultDto(false, "참가자 정보가 없습니다.");
    } else {
      if (participant.getRoleCode().getId() == 2L) {//나가려는 사람이 플레이어인 경우
        //플레이어 목록에서 ID 삭제 후 (토론이 끝나거나 새로 시작할 때 플레이어 정보는 초기화 되기때문에 ID만 삭제한다)
        playerRepository.deleteByRoomIdAndUserId(roomId, userId);
      }
      //사용자의 롤을 퇴장자로 변경
      participant.setRoleCode(new RoleCode(1L, null));
      //토론방의 현재인원을 차감 시킨다
      if (decrementRoomCurrentCount(roomId) == 0) {
        changeRoomStatus(roomId);
        return new MethodResultDto(true, "토론방 종료", null);
      } else {
        if (participant.isHost()) { //방장인 경우
          participant.setHost(false); //사용자 방장 권한 해제
          //가장 빨리 입장한 사람에게 방장 권한을 부여
          MethodResultDto result = getNextHost(roomId); //다음 방장 사용자 리턴
          if (result.isResult()) {
            Participant newHost = (Participant) result.getData();
            newHost.setHost(true);
            participantRepository.save(newHost);
          } else {
            return result;
          }
        }
        participantRepository.save(participant);
      }
    }
    return new MethodResultDto(true, "정상 퇴장 완료");
  }

  public ParticipantOutDto exitSocket(Long userId, Long roomId) {
    Participant participant = participantRepository.findAllByUserIdAndRoomId(userId, roomId);
    ParticipantOutDto participantOutDto = new ParticipantOutDto();
    if (participant == null) {
      // 예외처리
    } else {
      if (participant.getRoleCode().getId() == 2L) {//나가려는 사람이 플레이어인 경우
        //플레이어 목록에서 ID 삭제 후 (토론이 끝나거나 새로 시작할 때 플레이어 정보는 초기화 되기때문에 ID만 삭제한다)
        playerRepository.deleteByRoomIdAndUserId(roomId, userId);
      }
      //사용자의 롤을 퇴장자로 변경
      participant.setRoleCode(new RoleCode(1L, null));
      //토론방의 현재인원을 차감 시킨다
      if (decrementRoomCurrentCount(roomId) == 0) {
        changeRoomStatus(roomId);
        participantOutDto.setIsRoomChange(true);
      } else {
        if (participant.isHost()) { //방장인 경우
          participant.setHost(false); //사용자 방장 권한 해제
          //가장 빨리 입장한 사람에게 방장 권한을 부여
          MethodResultDto result = getNextHost(roomId); //다음 방장 사용자 리턴
          if (result.isResult()) {
            Participant newHost = (Participant) result.getData();
            newHost.setHost(true);
            participantRepository.save(newHost);
            participantOutDto.setIsHostChange(true);
          } else {
            // 예외 처리
          }
        }
        participantRepository.save(participant);
      }
    }
    return participantOutDto;
  }

  public int decrementRoomCurrentCount(Long roomId) {
    Room room = roomRepository.findById(roomId).orElse(null);
    if (room != null) {
      room.setCurPeople(room.getCurPeople() - 1);
      roomRepository.save(room);
    }
    return room.getCurPeople();
  }

  public void changeRoomStatus(Long roomId) {
    Room room = roomRepository.findById(roomId).orElse(null);
    if (room != null) {
      room.setStatus(Status.DONE);
      roomRepository.save(room);
    }
  }

  public MethodResultDto getParticipants(Long roomId) {
    List<ViewerDto> viewers = new ArrayList<>();
    List<PlayerResDto> players = new ArrayList<>();

    //퇴장자를 제외한 모든 유저를 불러온다.
    List<Participant> participants = participantRepository.findAllByRoomIdAndRoleCodeIdNot(roomId,
        1L);
    System.out.println(participants.size());
    if (!participants.isEmpty()) {
      for (Participant p : participants) {
        ViewerDto viewer = new ViewerDto(p.getUser().getId(), p.getUser().getNickname(),
            p.getUser().getColorItem().getRgb(), p.isHost(),p.getEnterTime());
        //플레이어인 경우
        System.out.println(p.getNickName());
        System.out.println(p.getRoleCode().getId());
        if (p.getRoleCode().getId() == 2L) {
          Player pInfo = playerRepository.findTopByRoomIdAndUserId(roomId, p.getUser().getId())
              .orElse(null);
          if (pInfo != null) {
            PlayerResDto player = new PlayerResDto(viewer, pInfo.isReady(),
                pInfo.isTopicTypeA(), pInfo.getHeartPoint());
            //플레이어 정보 추가
            players.add(player);
          }
        } else {
          //관전자 정보 추가
          viewers.add(viewer);
        }
      }
    }
    ParticipantsDto participantsDto = new ParticipantsDto(viewers, players);
    return new MethodResultDto(true, "참가자 조회 완료", participantsDto);
  }

}
