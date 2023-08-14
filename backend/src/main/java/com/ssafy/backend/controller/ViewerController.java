package com.ssafy.backend.controller;


import com.ssafy.backend.dto.Message;
import com.ssafy.backend.dto.MethodResultDto;
import com.ssafy.backend.dto.response.RoomInfoResponseDto;
import com.ssafy.backend.dto.response.RoomPeopleCountDto;
import com.ssafy.backend.dto.response.ViewerDto;
import com.ssafy.backend.entity.Participant;
import com.ssafy.backend.service.RoomService;
import com.ssafy.backend.service.ViewerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/viewer")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ViewerController {

  private final ViewerService viewerService;
  private final RoomService roomService;
  private final SimpMessagingTemplate messagingTemplate;

  @PostMapping("/{roomId}/{userId}")
  public ResponseEntity<Message> enterRoom(@PathVariable Long roomId, @PathVariable Long userId) {
    Message message = new Message(HttpStatus.OK, "테스트", null);
    ViewerDto viewerDto = null;
    if (viewerService.existsUser(userId, roomId)) {
      message.setMessage("재 입장 유저입니다.");
      Participant p = viewerService.reentryParticipant(userId, roomId);
      message.setData(p.getNickName());
      viewerDto = new ViewerDto(p.getUser().getId(),p.getNickName(),p.getUser().getColorItem().getRgb(),p.isHost(),p.getEnterTime());
    } else { //신규 추가
      message.setMessage("첫 입장 유저입니다.");
      Participant p = viewerService.firstEntryParticipant(userId, roomId);
      message.setData(p.getNickName());
      viewerDto = new ViewerDto(p.getUser().getId(),p.getNickName(),p.getUser().getColorItem().getRgb(),p.isHost(),p.getEnterTime());
    }
    //토론방 현재 인원 수 +1
    roomService.incrementRoomCurrentCount(roomId);
//    messagingTemplate.convertAndSend("/from/room/enter/" + roomId, viewerDto);
    return ResponseEntity.ok(message);
  }

  @GetMapping("/{roomId}")
  public ResponseEntity<Message> currentViewer(@PathVariable Long roomId) {
    Message message = new Message(HttpStatus.OK, "테스트", null);
    RoomInfoResponseDto response = roomService.getRoomInfoById(roomId);
    if (response == null) {
      message.setStatus(HttpStatus.BAD_REQUEST);
      message.setMessage("토론방이 없습니다.");
    } else {
      RoomPeopleCountDto roomPeopleCountDto = new RoomPeopleCountDto();
      roomPeopleCountDto.setValidCount(response.getMaxPeople());
      roomPeopleCountDto.setCurrentCount(response.getCurPeople());
      message.setMessage("토론방 인원 정보 조회 완료");
      message.setData(roomPeopleCountDto);
    }
    return ResponseEntity.ok(message);
  }

  @PatchMapping("/vote/{roomId}/{userId}")
  public ResponseEntity<Message> voteTopic(@PathVariable Long roomId, @PathVariable Long userId,
      @RequestParam(name = "vote") String selectedTopic) {
    Message message = new Message(HttpStatus.OK, "투표 성공", null);
    if (!viewerService.vote(userId, roomId, selectedTopic)) {
      message.setStatus(HttpStatus.BAD_REQUEST);
      message.setMessage("일정 시간 후 재투표가 가능합니다.");
    } else {
      messagingTemplate.convertAndSend("/from/vote/" + roomId,viewerService.voteResult(roomId));
    }
    return ResponseEntity.ok(message);
  }

  @GetMapping("/vote/{roomId}")
  public ResponseEntity<Message> voteResult(@PathVariable Long roomId) {
    Message message = new Message(HttpStatus.OK, "투표 결과 조회 성공", viewerService.voteResult(roomId));
    return ResponseEntity.ok(message);
  }

  /*
   * 토론방 나가기
   * */
  @DeleteMapping("/{roomId}/{userId}")
  public ResponseEntity<Message> exitRoom(@PathVariable Long roomId, @PathVariable Long userId) {
    Message message = new Message(HttpStatus.OK, "", null);

    MethodResultDto result = viewerService.exit(userId, roomId);
    message.setMessage(result.getMessage());
    if (!result.isResult()) {
      message.setStatus(HttpStatus.BAD_REQUEST);
    }
    return ResponseEntity.ok(message);
  }

  @GetMapping("/list/{roomId}")
  public ResponseEntity<Message> getViewers(@PathVariable Long roomId) {
    Message message = new Message(HttpStatus.OK, "", null);

    MethodResultDto result = viewerService.getParticipants(roomId);
    message.setMessage(result.getMessage());
    message.setData(result.getData());

    return ResponseEntity.ok(message);
  }

//  @GetMapping("/test/{roomId}")
//  public ResponseEntity<Message> test(@PathVariable Long roomId) {
//    MethodResultDto result = viewerService.test(roomId);
//    Message message = new Message(HttpStatus.OK, "", null);
//    if (!result.isResult()) {
//      message.setStatus(HttpStatus.BAD_REQUEST);
//      message.setMessage(result.getData().toString());
//    } else {
//      message.setMessage("방장은 얘로 바꾼다.");
//      message.setData(result.getData());
//    }
//    return ResponseEntity.ok(message);
//  }
}
