package com.ssafy.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlayerTurnChangeDto {
    private Long roomId;
    private Long userId;
    @JsonProperty("isATurn")
    private boolean isATurn;
}
