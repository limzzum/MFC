package com.ssafy.backend.controller;

import com.ssafy.backend.dto.Message;
import com.ssafy.backend.dto.request.AddPenaltyDto;
import com.ssafy.backend.dto.response.PenaltyDto;
import com.ssafy.backend.entity.Penalty;
import com.ssafy.backend.entity.PenaltyCode;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.service.PenaltyCodeService;
import com.ssafy.backend.service.PenaltyService;
import com.ssafy.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/penalty")
@RequiredArgsConstructor
public class PenaltyController {

  private final PenaltyService penaltyService;
  private final PenaltyCodeService penaltyCodeService;
  private final UserService userService;


  @PostMapping
  public ResponseEntity<Message> addPenalty(@RequestBody AddPenaltyDto request) {
    User user = userService.findById(request.getUserId()); // User 조회
    PenaltyCode penaltyCode = penaltyCodeService.findByCode(
        request.getPenaltyCodeId()); // PenaltyCode 조회

    Penalty penalty = Penalty.builder()
        .penaltyCode(penaltyCode)
        .user(user)
        .penaltyTime(request.getPenaltyTime())
        .build();
    penaltyService.save(penalty);

    Message message = new Message(HttpStatus.CREATED, "패널티 등록 완료", request);
    return ResponseEntity.ok(message);
  }

  @GetMapping
  public ResponseEntity<Message> getPenaltyCode() {
    Message message = new Message(HttpStatus.OK, "패널티 코드 조회 완료", penaltyCodeService.findAll());
    return ResponseEntity.ok(message);
  }

  @GetMapping("/list/{roomId}/{userId}")
  public ResponseEntity<Message> getPenaltyListById(@PathVariable Long roomId, @PathVariable Long userId) {
    List<PenaltyDto> penaltyDtoList = penaltyService.findAllPenalty(userId);
    Message message = new Message(HttpStatus.OK, "패널티 조회 성공",
            penaltyDtoList);
    if(penaltyDtoList.isEmpty()){
      message.setMessage("조회된 패널티가 없습니다.");
      return ResponseEntity.ok(message);
    }
    return ResponseEntity.ok(message);
  }

}
