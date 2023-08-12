package com.ssafy.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PenaltyRequestDto {
    private Long roomId;
    private Long userId;
    private Long penaltyCodeId;

}
