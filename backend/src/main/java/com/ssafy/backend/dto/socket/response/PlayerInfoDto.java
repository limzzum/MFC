package com.ssafy.backend.dto.socket.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.backend.entity.ItemCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlayerInfoDto {

    private Long userId;
    private String nickname;
    private String profile;
    private ItemCode colorItem;
    @JsonProperty("isATopic")
    private boolean isATopic;
    @JsonProperty("isReady")
    private boolean isReady;
    @JsonProperty("isAllReady")
    private boolean isAllReady;
}
