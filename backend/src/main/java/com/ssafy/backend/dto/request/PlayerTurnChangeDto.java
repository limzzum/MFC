package com.ssafy.backend.dto.request;

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
    private boolean isATurn;
}
