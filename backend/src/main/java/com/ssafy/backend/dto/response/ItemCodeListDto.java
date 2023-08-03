package com.ssafy.backend.dto.response;

import com.ssafy.backend.entity.ItemCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemCodeListDto {

  private Long itemCodeId;
  private String name;
  private String iconName;
  private String comment;
  private int price;
  private String rgb;

}
