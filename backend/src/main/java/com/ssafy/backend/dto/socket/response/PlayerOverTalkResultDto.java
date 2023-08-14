package com.ssafy.backend.dto.socket.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlayerOverTalkResultDto {

    private Long userId;
    private boolean isTopicA;
    private LocalDateTime startTalkTime;
    private int remainOverTime;
    private boolean isUsed;
}
