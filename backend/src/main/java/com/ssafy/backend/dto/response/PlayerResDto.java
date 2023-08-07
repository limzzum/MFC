package com.ssafy.backend.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlayerResDto {

  private ViewerDto viewerDto;
  private boolean isReady;
  private boolean isTopicTypeA;
  private int heartPoint;

}
