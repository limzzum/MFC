package com.ssafy.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserItemListDto {

    private Long UserItemId;
    private int count;
    private String comment;
    private Long itemCodeId;
    private String iconName;
    private String name;
    private String rgb;

}
