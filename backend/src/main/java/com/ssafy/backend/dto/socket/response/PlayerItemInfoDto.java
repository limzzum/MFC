package com.ssafy.backend.dto.socket.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlayerItemInfoDto {

    private Long userId;
    private String nickname;
    @JsonProperty("isATopic")
    private boolean isATopic;
    private Long itemCodeId;
    @JsonProperty("isUsed")
    private boolean isUsed;
    private String message;
}
