package com.ssafy.backend.dto.request;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlayerUpdateDto {

    private Long roomId;
    private Long userId;
    private int heartPoint;
}
