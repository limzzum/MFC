package com.ssafy.backend.dto.response;

import com.ssafy.backend.entity.UsedItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsedItemDto {

    private Long usedItemId;
    private Long itemCodeId;
    private Long playerId;

    public UsedItemDto(UsedItem usedItem) {
        this.usedItemId = usedItem.getId();
        this.itemCodeId = usedItem.getItemcode() != null ? usedItem.getItemcode().getId() : null;
//        this.playerId = usedItem.getPlayer() != null ? usedItem.getPlayer().getId() : null;
    }
}
