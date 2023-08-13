package com.ssafy.backend.dto.socket.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlayerStatusDto {
    private Long userId;
    private boolean isATopic;
    private int hp;
}
