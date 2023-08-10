package com.ssafy.backend.dto.socket.response;

import com.ssafy.backend.entity.ItemCode;
import com.ssafy.backend.entity.UserItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlayerItemInfoDto {

    private String nickname;
    private String profile;
    private ItemCode colorItem;
    private boolean isTopicA;
    private Long itemCodeId;
}
