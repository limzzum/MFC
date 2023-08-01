package com.ssafy.backend.controller;

import com.ssafy.backend.service.PenaltyCodeService;
import com.ssafy.backend.service.PenaltyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/penalty")
@RequiredArgsConstructor
public class PenaltyController {

  private final PenaltyService penaltyService;
  private final PenaltyCodeService penaltyCodeService;

//  @PostMapping
//  public ResponseEntity<Penalty> addPenalty(@RequestBody AddPenaltyDto request) {
//    Penalty penalty = Penalty.builder()
//        .penaltyCodeId(request.getPenaltyCodeId())
//        .userId(request.getUserId())
//        .roomId(request.getRoomId())
//        .penaltyTime(request.getPenaltyTime())
//        .build();
//
//    penaltyService.save(penalty);
//    return ResponseEntity.status(HttpStatus.CREATED) //201 Created 성공 및 새로운 리소스 생성
//        .body(penalty);
//  }
}
