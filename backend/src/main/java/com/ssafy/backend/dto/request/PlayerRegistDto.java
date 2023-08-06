package com.ssafy.backend.dto.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerRegistDto {
    private Long roomId;
    private Long userId;
    private boolean isATopic;
}
