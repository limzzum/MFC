package com.ssafy.backend.dto.socket.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerItemDto {
    private Long roomId;
    private Long userId;
    private boolean isTopicA;
    private Long itemCodeId;

}
