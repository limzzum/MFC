package com.ssafy.backend.controller;

import com.ssafy.backend.dto.request.UsedItemCreateDto;
import com.ssafy.backend.dto.response.UserItemListDto;
import com.ssafy.backend.service.ItemService;
    import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/item")
public class ItemController {

  private final ItemService itemService;
  @GetMapping("/list")
  public ResponseEntity<?> itemCodeList() {
    //try { 회원하면 예외처리하기
    return ResponseEntity.ok(itemService.findAll());
    //} catch ()
  }

    @GetMapping("/list/{userId}")
    public ResponseEntity<?> userItemList(@PathVariable Long userId) {
        //try { 회원하면 예외처리하기
        // 빈 리스트일 때 예외 처리 하기!
        List<UserItemListDto> userItemslist = itemService.userItemfindAll(userId);
        if (userItemslist.isEmpty()) {
            return ResponseEntity.ok("보유 아이템이 없습니다."); // 데이터가 없을 경우 메시지를 담은 응답
        }
        return ResponseEntity.ok(userItemslist);
        //} catch ()
    }

    // 시간되면 수정할 것
//    @PostMapping("")
//    public ResponseEntity<?> usedItemCreate(@RequestBody UsedItemCreateDto usedItemCreateDto) {
//
//        Long userId = usedItemCreateDto.getUserId();
//        Long itemId = usedItemCreateDto.getItemId();
//        Long roomId = usedItemCreateDto.getRoomId();
//
//        // 플레이어의 아이템이 사용 가능한지 확인
//        // 1. userId와 roomId로 playerId 조회
//        // 2. playerId, itemId로 사용 가능한지 여부 조회
//        // 3. 사용한 적이 있다면 => body에 message 작성해서 보내기
//        // 4. 사용한 적이 없다면 =>
//        // 4.1 userId로 userItem count 수 차감
//        // 4.2 playerId, itemId로 아이템 등록해줌
//        // 4.3 허가메시지 보내주기 ( + playerId, itemcodeId 보내주기 )
//
//    }

//    @PostMapping("/purchase/{userId}/{itemId}")
//    public ResponseEntity<?> userItemBuy(@PathVariable Long userId, @PathVariable Long itemId) {
//
//      // 닉네임 커스텀 확인하기
//      // 확인하고 맞으면 회원정보와 구매 정보 변경!
        // userId와 itemId로 조회해서 있을 경우 count 수 증가 없다면 생성해주기!
//    }

}
