package com.ssafy.backend.dto.socket.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ItemFailDto {
    private Long userId;
    private String nickname;
    private Long itemCodeId;
    private String message;
}
