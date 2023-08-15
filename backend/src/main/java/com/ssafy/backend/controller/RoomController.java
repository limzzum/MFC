package com.ssafy.backend.controller;
import com.ssafy.backend.dto.Message;
import com.ssafy.backend.dto.request.RoomInfoRuquestDto;
import com.ssafy.backend.dto.response.RoomInfoResponseDto;
import com.ssafy.backend.dto.response.RoomListDto;
import com.ssafy.backend.dto.socket.response.RoomStatusDto;
import com.ssafy.backend.entity.UploadFile;
import com.ssafy.backend.file.FileStore;
import com.ssafy.backend.service.HistoryService;
import com.ssafy.backend.service.ParticipantService;
import com.ssafy.backend.service.RoomService;

import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/debate")
//@CrossOrigin(origins = "*", allowedHeaders = "*")
public class RoomController {

    private final RoomService roomService;
    private final ParticipantService participantService;
    private final HistoryService historyService;
    private final FileStore fileStore;

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
    @PatchMapping("/{roomId}") // 토론방 수정 api ( websocket에서만 사용하면 추후 삭제 )
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

    @PostMapping("/image")
    public ResponseEntity<Message> profile(@RequestParam MultipartFile image) throws IOException {
        if(image.isEmpty()){
            return ResponseEntity.ok(new Message(HttpStatus.OK, "사진이 선택되지 않았습니다", null));
        }
        UploadFile uploadFile = fileStore.storeFile(image);
        return ResponseEntity.ok(new Message(HttpStatus.OK, "파일 업로드 성공", uploadFile.getFilePath()));
    }

    @GetMapping("/status/{roomId}")
    public ResponseEntity<Message> getRoomStatus(@PathVariable Long roomId) {
        RoomStatusDto roomStatus = roomService.getRoomStatus(roomId);
        if(roomStatus == null){
            return ResponseEntity.ok(new Message(HttpStatus.BAD_REQUEST, "존재하지 않는 room",null));
        }
        return ResponseEntity.ok(new Message(HttpStatus.OK, "룸 상태 정보 조회 성공",roomStatus));
    }
}
