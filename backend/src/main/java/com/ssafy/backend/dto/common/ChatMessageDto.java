package com.ssafy.backend.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatMessageDto {

  private Long roomId;
  private String nickName;
  private String message;

}
