package com.ssafy.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsedItemallowDto {

  private Long usedItemId;
  private Long ItemCodeId;
  private Long playerId;

}
