package com.ssafy.backend.controller;

import com.ssafy.backend.dto.Message;
import com.ssafy.backend.dto.request.HistoryReqDto;
import com.ssafy.backend.dto.response.HistoryResDto;
import com.ssafy.backend.entity.History;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.service.HistoryService;
import com.ssafy.backend.service.PenaltyCodeService;
import com.ssafy.backend.service.PenaltyService;
import com.ssafy.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/record")
@RequiredArgsConstructor
public class HistoryController {

  private final PenaltyCodeService penaltyCodeService;
  private final UserService userService;
  private final HistoryService historyService;

  @PostMapping
  public ResponseEntity<Message> addUserHistory(@RequestBody HistoryReqDto request) {
    User user = userService.findById(request.getUserId()); // User 조회
    Message message = new Message(HttpStatus.CREATED, "전적 추가 완료", request);

    if(!historyService.existByUserId(request.getUserId())) {//아이디가 없으면
      History history = History.builder()
              .user(user)
              .coin(request.getCoin())
              .experience(request.getExp())
              .build();
      historyService.save(history);
    }
    else {//있으면
      message.setStatus(HttpStatus.OK);
      message.setMessage("전적 변경 완료");
      historyService.change(request);
    }
    return ResponseEntity.ok(message);
  }

  @GetMapping("/{userId}")
  public ResponseEntity<Message> findById(@PathVariable Long userId) {

    HistoryResDto historyResDto = historyService.findById(userId);
    Message message = new Message(HttpStatus.OK, "전적 조회 성공",
            historyResDto);

    if(historyResDto == null){
      message.setMessage("조회된 전적이 없습니다.");
      return ResponseEntity.ok(message);
    }

    return ResponseEntity.ok(message);

  }
//
//  @GetMapping("/list")
//  public ResponseEntity<Message> getAllRank(@PageableDefault Pageable pageable){
//    Message message = new Message(HttpStatus.OK, "랭킹 조회 완료", historyService.getAllHistory(pageable));
//    return ResponseEntity.ok(message);
//  }

//  @GetMapping
//  public ResponseEntity<Message> getPenaltyCode() {
//    Message message = new Message(HttpStatus.OK, "패널티 코드 조회 완료", penaltyCodeService.findAll());
//    return ResponseEntity.ok(message);
//  }
//
//  @GetMapping("/list/{roomId}/{userId}")
//  public ResponseEntity<Message> getPenaltyListById(@PathVariable Long roomId, @PathVariable Long userId) {
//    List<PenaltyDto> penaltyDtoList = penaltyService.findAllPenalty(userId);
//    Message message = new Message(HttpStatus.OK, "패널티 조회 성공",
//            penaltyDtoList);
//    if(penaltyDtoList.isEmpty()){
//      message.setMessage("조회된 패널티가 없습니다.");
//      return ResponseEntity.ok(message);
//    }
//    return ResponseEntity.ok(message);
//  }

}
