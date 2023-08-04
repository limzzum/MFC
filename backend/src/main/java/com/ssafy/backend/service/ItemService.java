package com.ssafy.backend.service;

import com.ssafy.backend.dto.Message;
import com.ssafy.backend.dto.response.ItemCodeListDto;
import com.ssafy.backend.dto.response.UserItemListDto;
import com.ssafy.backend.entity.History;
import com.ssafy.backend.entity.ItemCode;
import com.ssafy.backend.entity.Player;
import com.ssafy.backend.entity.UsedItem;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.entity.UserItem;
import com.ssafy.backend.repository.HistoryRepository;
import com.ssafy.backend.repository.ItemCodeRepository;

import com.ssafy.backend.repository.PlayerRepository;
import com.ssafy.backend.repository.UsedItemRepository;
import com.ssafy.backend.repository.UserRepository;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import com.ssafy.backend.repository.UserItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Transactional
@RequiredArgsConstructor
@Service
public class ItemService {

  private final ItemCodeRepository itemCodeRepository;
  private final UserItemRepository userItemRepository;
  private final HistoryRepository historyRepository;
  private final UserRepository userRepository;
  private final PlayerRepository playerRepository;
  private final UsedItemRepository usedItemRepository;

  public List<ItemCodeListDto> findAll() {
    List<ItemCode> itemCodes = itemCodeRepository.findAll(Sort.by(Direction.DESC, "id"));
    List<ItemCodeListDto> allItemCodes = itemCodes.stream()
        .map(itemCode -> {
          return ItemCodeListDto.builder()
              .itemCodeId(itemCode.getId())
              .name(itemCode.getName())
              .iconName(itemCode.getIconName())
              .comment(itemCode.getComment())
              .price(itemCode.getPrice())
              .rgb(itemCode.getRgb())
              .build();
        })
        .collect(Collectors.toList());

    return allItemCodes;
  }

  public List<UserItemListDto> userItemfindAll(Long userId) {
      List<UserItem> userItems = userItemRepository.findAllUserItem(userId);
      if(userItems.isEmpty()) {
          return Collections.emptyList();
      }
      List<UserItemListDto> allUserItem = userItems.stream()
              .map(userItem -> {
                  return UserItemListDto.builder()
                          .UserItemId(userItem.getId())
                          .count(userItem.getCount())
                          .comment(userItem.getItemCode().getComment())
                          .itemCodeId(userItem.getItemCode().getId())
                          .iconName(userItem.getItemCode().getIconName())
                          .name(userItem.getItemCode().getName())
                          .rgb(userItem.getItemCode().getRgb())
                          .build();
              })
              .collect(Collectors.toList());
      return allUserItem;
  }

  public Optional findColorItemCode(String itemName) {
    return itemCodeRepository.findItemCodeByNameContaining(itemName);
  }
  public Message buyItem(Long userId, ItemCode itemCode) {
    Message message = new Message();
    Optional<User> userOP = userRepository.findById(userId);
    History history = historyRepository.findTopByUserId(userId);
    if(userOP.isPresent()) {
      if(history == null) {
        message.setStatus(HttpStatus.BAD_REQUEST);
        message.setMessage("해당 유저의 전적을 찾을 수 없습니다.");
      }else {
        int userCoin = history.getCoin() - itemCode.getPrice();
        if(userCoin < 0) {
          message.setStatus(HttpStatus.BAD_REQUEST);
          message.setMessage("유저의 코인이 부족해 아이템을 구매할 수 없습니다.");
        }else {
          history.setCoin(userCoin);
          historyRepository.save(history);
          UserItem userItem = userItemRepository.findByUserIdAndItemCodeId(userId, itemCode.getId());
          if(userItem == null) {
            UserItem useritem = UserItem.builder()
                .count(1)
                .itemCode(itemCode)
                .user(userOP.get())
                .build();
            userItemRepository.save(useritem);
          }else {
            userItem.setCount(userItem.getCount() + 1);
            userItemRepository.save(userItem);
          }
          message.setStatus(HttpStatus.OK);
          message.setMessage("아이템 구매 성공");
        }
      }
    } else {
      message.setStatus(HttpStatus.BAD_REQUEST);
      message.setMessage("해당 유저를 찾을 수 없습니다.");
    }
    return message;
  }
  public String getUsedItem(Long userId, Long roomId, Long itemId) {
    Player player = playerRepository.findTopByRoomIdAndUserId(roomId,userId).orElse(null);
    if(player != null) {
      Optional<UsedItem> usedItem = usedItemRepository.findTopByPlayerIdAndItemcodeId(player.getId(),itemId);
      if(usedItem.isPresent()) {
        return "해당 토론방에서 이미 사용한 아이템입니다.";
      }else {
        UserItem userItem = userItemRepository.findByUserIdAndItemCodeId(userId,itemId);
        if(userItem == null || userItem.getCount() == 0) {
          return "사용자가 해당 아이템을 가지고 있지 않습니다.";
        }else {
          userItem.setCount(userItem.getCount() - 1);
          userItemRepository.save(userItem);
        }
        ItemCode itemcode = itemCodeRepository.getOne(itemId);
        UsedItem itemCreate = UsedItem.builder()
            .itemcode(itemcode)
            .player(player)
            .build();
        usedItemRepository.save(itemCreate);
        return "아이템 사용 가능";
      }}else {
      return "해당 플레이어를 찾을 수 없습니다.";
    }
  }

}
