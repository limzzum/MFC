package com.ssafy.backend.controller;
import com.ssafy.backend.dto.request.RoomInfoRuquestDto;
import com.ssafy.backend.dto.response.RoomInfoResponseDto;
import com.ssafy.backend.dto.response.RoomListDto;
import com.ssafy.backend.service.RoomService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/debate")
public class RoomController {

    private final RoomService roomService;

    @GetMapping("/list/ongoing")
    public ResponseEntity<?> ongoingRoomList(@RequestParam Long minRoomId,@RequestParam int size) {
//        try {
        System.out.println("----1-----");
        List<RoomListDto> talkRoomList = roomService.ongoingRoomList(minRoomId,size);
        System.out.println("----2-----");
        return ResponseEntity.ok(talkRoomList);
//        }

    };
    @GetMapping("/list/waiting")
    public ResponseEntity<?> waitingRoomList(@RequestParam Long minRoomId,@RequestParam int size) {
//        try {
        System.out.println("----1-----");
        List<RoomListDto> talkRoomList = roomService.waitingRoomList(minRoomId,size);
        System.out.println("----2-----");
        return ResponseEntity.ok(talkRoomList);
//        }

    }

    @GetMapping("/listWithKeyword")
    public ResponseEntity<?> ongoingRoomList(@RequestParam String keyword,@RequestParam Long minRoomId,@RequestParam int size) {
//        try {
        List<RoomListDto> roomList = roomService.searchRoomsByKeyword(keyword, minRoomId, size);
        return ResponseEntity.ok(roomList);
//        }

    };
    @PostMapping
    public ResponseEntity<?> roomCreate(@RequestBody RoomInfoRuquestDto roomInfoRuquestDto) {
        return ResponseEntity.ok(roomService.createRoom(roomInfoRuquestDto));
    }
    @PatchMapping("/{roomId}")
    public ResponseEntity<?> roomUpdate(@PathVariable Long roomId,@RequestBody RoomInfoRuquestDto roomInfoRuquestDto) {
        RoomInfoResponseDto updatedRoom = roomService.updateRoom(roomId, roomInfoRuquestDto);
        if (updatedRoom == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedRoom);

    }
    @GetMapping("/{roomId}")
    public ResponseEntity<?> roomInfo(@PathVariable Long roomId) {
        RoomInfoResponseDto roomInfo = roomService.getRoomInfoById(roomId);
        if (roomInfo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(roomInfo);
    }



}
