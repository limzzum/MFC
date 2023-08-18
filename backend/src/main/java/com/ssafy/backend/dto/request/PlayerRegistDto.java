package com.ssafy.backend.dto.request;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerRegistDto {
    private Long roomId;
    private Long userId;
    private boolean isATopic;
}
