package com.ssafy.backend.controller;
import com.ssafy.backend.dto.Message;
import com.ssafy.backend.dto.request.RoomInfoRuquestDto;
import com.ssafy.backend.dto.response.RoomInfoResponseDto;
import com.ssafy.backend.dto.response.RoomListDto;
import com.ssafy.backend.service.ParticipantService;
import com.ssafy.backend.service.RoomService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/debate")
public class RoomController {

    private final RoomService roomService;
    private final ParticipantService participantService;

    @GetMapping("/list/ongoing")
    public ResponseEntity<?> ongoingRoomList(@RequestParam Long minRoomId,@RequestParam int size) {
//        try {
        List<RoomListDto> roomList = roomService.ongoingRoomList(minRoomId,size);
        Message message = new Message(HttpStatus.OK,"토론방 ongoing 리스트 가져오기 성공",roomList);
        return ResponseEntity.ok(message);
//        }
    };
    @GetMapping("/list/waiting")
    public ResponseEntity<?> waitingRoomList(@RequestParam Long minRoomId,@RequestParam int size) {
//        try
        List<RoomListDto> roomList = roomService.waitingRoomList(minRoomId,size);
        Message message = new Message(HttpStatus.OK,"토론방 waiting 리스트 가져오기 성공",roomList);
        return ResponseEntity.ok(message);
//        }
    }

    @GetMapping("/listWithKeyword")
    public ResponseEntity<?> ongoingRoomList(@RequestParam String keyword,@RequestParam Long minRoomId,@RequestParam int size) {
//        try {
        List<RoomListDto> roomList = roomService.searchRoomsByKeyword(keyword, minRoomId, size);
        Message message = new Message(HttpStatus.OK,"토론방 키워드 검색 리스트 가져오기 성공",roomList);
        return ResponseEntity.ok(message);
//        }

    };
    @PostMapping("/{userId}")
    public ResponseEntity<?> roomCreate(@PathVariable Long userId,@RequestBody RoomInfoRuquestDto roomInfoRuquestDto) {
        Message message = new Message(HttpStatus.OK,"토론방 생성 성공",roomService.createRoom(userId, roomInfoRuquestDto));
        return ResponseEntity.ok(message);
    }
    @PatchMapping("/{roomId}")
    public ResponseEntity<?> roomUpdate(@PathVariable Long roomId,@RequestBody RoomInfoRuquestDto roomInfoRuquestDto) {
        RoomInfoResponseDto updatedRoom = roomService.updateRoom(roomId, roomInfoRuquestDto);
        Message message = new Message(HttpStatus.OK,"토론방 수정 성공",updatedRoom);
        if (updatedRoom == null) {
            message.setStatus(HttpStatus.BAD_REQUEST);
            message.setMessage("토론방을 찾을 수 없습니다.");
        }
        return ResponseEntity.ok(message);

    }
    @GetMapping("/{roomId}")
    public ResponseEntity<?> roomInfo(@PathVariable Long roomId) {
        RoomInfoResponseDto roomInfo = roomService.getRoomInfoById(roomId);
        Message message = new Message(HttpStatus.OK,"토론방 조회 성공",roomInfo);
        if (roomInfo == null) {
            message.setStatus(HttpStatus.BAD_REQUEST);
            message.setMessage("토론방을 찾을 수 없습니다.");
        }
        return ResponseEntity.ok(message);
    }

    @PatchMapping("reset/{roomId}")
    public ResponseEntity<?> roomReset(@PathVariable Long roomId) {
        Message message = roomService.roomReset(roomId);
        if(message.getStatus() == HttpStatus.OK) {
            participantService.resetParticipants(roomId);
            message.setMessage("토론방 관련 정보 리셋 성공");
        }
        return ResponseEntity.ok(message);
    }


}
