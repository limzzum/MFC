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
public class ViewerDto {

  private Long userId;
  private String nickName;
  private String nickNameColorCode;
  private boolean isHost;
}
