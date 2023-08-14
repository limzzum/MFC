package com.ssafy.backend.dto.socket.response;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("isATopic")
    private boolean isATopic;
    private LocalDateTime startTalkTime;
    private int remainOverTime;
    @JsonProperty("isUsed")
    private boolean isUsed;
}
