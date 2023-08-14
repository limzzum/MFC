package com.ssafy.backend.dto.socket.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerItemDto {
    private Long roomId;
    private Long userId;
    @JsonProperty("isATopic")
    private boolean isATopic;
    private Long itemCodeId;

}
