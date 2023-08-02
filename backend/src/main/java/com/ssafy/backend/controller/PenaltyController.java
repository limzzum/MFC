package com.ssafy.backend.controller;

import com.ssafy.backend.dto.Message;
import com.ssafy.backend.dto.request.AddPenaltyDto;
import com.ssafy.backend.entity.Penalty;
import com.ssafy.backend.entity.PenaltyCode;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.service.PenaltyCodeService;
import com.ssafy.backend.service.PenaltyService;
import com.ssafy.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
    System.out.println(request.getUserId());
    System.out.println(request.getPenaltyTime());
    System.out.println(request.getRoomId());
    System.out.println(request.getPenaltyCodeId());
    System.out.println(ResponseEntity.ok().toString());

    User user = userService.findById(request.getUserId()); // User 조회
    System.out.println(user.getNickname());
    PenaltyCode penaltyCode = penaltyCodeService.findByCode(
        request.getPenaltyCodeId()); // PenaltyCode 조회
    System.out.println(penaltyCode.getName());

    System.out.println(penaltyCode);
    Penalty penalty = Penalty.builder()
        .penaltyCode(penaltyCode)
        .user(user)
        .penaltyTime(request.getPenaltyTime())
        .build();
    penaltyService.save(penalty);

    Message message = new Message(HttpStatus.CREATED, "penalty 등록 완료", request);
    return ResponseEntity.ok(message);
  }

  @GetMapping
  public ResponseEntity<Message> getPenaltyCode() {
    System.out.println(penaltyService.findAllPenalty());

    Message message = new Message(HttpStatus.OK, "penaltycode 조회 완료",
        penaltyService.findAllPenalty());
//    Message message = new Message(HttpStatus.OK, "penaltycode 조회 완료", penaltyCodeService.findAll());
    return ResponseEntity.ok(message);
  }

}
