package com.ssafy.backend.controller;

import com.ssafy.backend.dto.Message;
import com.ssafy.backend.dto.request.UsedItemCreateDto;
import com.ssafy.backend.dto.response.UserItemListDto;
import com.ssafy.backend.entity.ItemCode;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.service.ItemService;
import com.ssafy.backend.service.UserService;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/item")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ItemController {

  private final ItemService itemService;
  private final UserService userService;
  @GetMapping("/list")
  public ResponseEntity<?> itemCodeList() {
    //try { 회원하면 예외처리하기
    Message message = new Message(HttpStatus.OK,"아이템 코드 조회 성공",itemService.findAll());
    return ResponseEntity.ok(message);
    //} catch ()
  }

    @GetMapping("/list/{userId}")
    public ResponseEntity<?> userItemList(@PathVariable Long userId) {
        //try { 회원하면 예외처리하기
        // 빈 리스트일 때 예외 처리 하기!
      List<UserItemListDto> userItemslist = itemService.userItemfindAll(userId);
      Message message = new Message(HttpStatus.OK,"사용자 보유 아이템 조회 성공",userItemslist);
        if (userItemslist.isEmpty()) {
          message.setMessage("사용자 보유 아이템이 없습니다.");
        }
        return ResponseEntity.ok(message);
        //} catch ()
    }
//    @PostMapping("/use")
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

    @PostMapping("/purchase/{userId}")
    public ResponseEntity<?> userItemBuy(@PathVariable Long userId, @RequestParam String itemName) {
    // itemCode조회
      Optional<ItemCode> itemCode = itemService.findColorItemCode(itemName);
      Message message = new Message();
      if(itemCode.isPresent()) {
        if(itemName.contains("스프레이") && itemCode.get().getRgb() != null) {
          return ResponseEntity.ok(userService.userItemCodeUpdate(userId,itemCode.get()));
        }else {
          return ResponseEntity.ok(itemService.buyItem(userId,itemCode.get()));
        }
      } else {
        message.setStatus(HttpStatus.BAD_REQUEST);
        message.setMessage("해당하는 아이템이 없습니다.");
        return ResponseEntity.ok(message);
      }
    }

}
