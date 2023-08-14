package com.ssafy.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlayerPlusTimeDto {
    private Long roomId;
    private Long curUserId;
    private boolean isATurn;
    private long plusTime;
}
