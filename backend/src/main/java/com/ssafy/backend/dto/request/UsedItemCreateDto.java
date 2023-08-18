package com.ssafy.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsedItemCreateDto {

    private Long userId;
    private Long itemId;
    private Long roomId;
}
