package com.ssafy.backend.dto.socket.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerRequestDto {
    private Long roomId;
    private Long userId;
    private boolean isTopicA;
    private boolean isReady;
}

