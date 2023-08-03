package com.ssafy.backend.controller;


import com.ssafy.backend.dto.Message;
import com.ssafy.backend.dto.response.RoomInfoResponseDto;
import com.ssafy.backend.dto.response.RoomPeopleCountDto;
import com.ssafy.backend.service.RoomService;
import com.ssafy.backend.service.ViewerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/viewer")
@RequiredArgsConstructor
public class ViewerController {

  private final ViewerService viewerService;
  private final RoomService roomService;

  @GetMapping("/{roomId}/{userId}")
  public ResponseEntity<Message> enterRoom(@PathVariable Long roomId, @PathVariable Long userId) {
    Message message = new Message(HttpStatus.OK, "테스트", null);

    if (viewerService.existsUser(userId, roomId)) {
      message.setMessage("재 입장 유저입니다.");
      message.setData(viewerService.reentryParticipant(userId, roomId).getNickName());
    } else { //신규 추가
      message.setMessage("첫 입장 유저입니다.");
      message.setData(viewerService.firstEntryParticipant(userId, roomId).getNickName());
    }
    //토론방 현재 인원 수 +1
    roomService.incrementRoomCurrentCount(roomId);
    return ResponseEntity.ok(message);
  }

  @GetMapping("/{roomId}")
  public ResponseEntity<Message> currentViewer(@PathVariable Long roomId){
    Message message = new Message(HttpStatus.OK, "테스트", null);
    RoomInfoResponseDto response = roomService.getRoomInfoById(roomId);
    if(response == null) {
      message.setStatus(HttpStatus.BAD_REQUEST);
      message.setMessage("토론방이 없습니다.");
    }
    else {
      RoomPeopleCountDto roomPeopleCountDto = new RoomPeopleCountDto();
      roomPeopleCountDto.setValidCount(response.getMaxPeople());
      roomPeopleCountDto.setCurrentCount(response.getCurPeople());
      message.setMessage("토론방 인원 정보 조회 완료");
      message.setData(roomPeopleCountDto);
    }
    return ResponseEntity.ok(message);
  }


}
