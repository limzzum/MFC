package com.ssafy.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PenaltyRequestDto {
    private Long roomId;
    private Long userId;
    @JsonProperty("isATopic")
    private boolean isATopic;
    private Long penaltyCodeId;

}
