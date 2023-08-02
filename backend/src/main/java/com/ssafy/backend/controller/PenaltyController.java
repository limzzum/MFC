package com.ssafy.backend.controller;

import com.ssafy.backend.dto.Message;
import com.ssafy.backend.dto.request.AddPenaltyDto;
import com.ssafy.backend.service.PenaltyCodeService;
import com.ssafy.backend.service.PenaltyService;
import com.ssafy.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/penalty")
@RequiredArgsConstructor
public class PenaltyController {

  private final PenaltyService penaltyService;
  private final PenaltyCodeService penaltyCodeService;
  private final UserService userService;


  @PostMapping
  public ResponseEntity<Message> addPenalty(@RequestBody AddPenaltyDto request) {
//    System.out.println(request.getUserId());
//    System.out.println(request.getPenaltyTime());
//    System.out.println(request.getRoomId());
//    System.out.println(request.getPenaltyCodeId());
//    System.out.println(ResponseEntity.ok().toString());
//
//    User user = userService.findUser(request.getUserId()); // User 조회
//    PenaltyCode penaltyCode = penaltyCodeService.findByCode(
//        request.getPenaltyCodeId()); // PenaltyCode 조회
//    Penalty penalty = Penalty.builder()
//        .penaltyCode(penaltyCode)
//        .user(user)
//        .penaltyTime(request.getPenaltyTime())
//        .build();
//    penaltyService.save(penalty);

    Message message = new Message(HttpStatus.CREATED, "penalty 등록 완료", request);
    return ResponseEntity.ok(message);
  }

}
