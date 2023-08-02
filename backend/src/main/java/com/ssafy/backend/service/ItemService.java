package com.ssafy.backend.service;

import com.ssafy.backend.dto.response.ItemCodeListDto;
import com.ssafy.backend.dto.response.UserItemListDto;
import com.ssafy.backend.entity.ItemCode;
import com.ssafy.backend.entity.UserItem;
import com.ssafy.backend.repository.ItemCodeRepository;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import com.ssafy.backend.repository.UserItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

@Transactional
@RequiredArgsConstructor
@Service
public class ItemService {

  private final ItemCodeRepository itemCodeRepository;
  private final UserItemRepository userItemRepository;

  public List<ItemCodeListDto> findAll() {
    List<ItemCode> itemCodes = itemCodeRepository.findAll(Sort.by(Direction.DESC, "id"));
    List<ItemCodeListDto> allItemCodes = itemCodes.stream()
        .map(itemCode -> {
          return ItemCodeListDto.builder()
              .itemCodeId(itemCode.getId())
              .name(itemCode.getName())
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
                          .name(userItem.getItemCode().getName())
                          .rgb(userItem.getItemCode().getRgb())
                          .build();
              })
              .collect(Collectors.toList());
      return allUserItem;
  }

}
