package com.ssafy.backend.dto.socket.request;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("isATopic")
    private boolean isATopic;
    @JsonProperty("isReady")
    private boolean isReady;
}

