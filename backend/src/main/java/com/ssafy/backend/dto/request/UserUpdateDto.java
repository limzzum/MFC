package com.ssafy.backend.dto.request;

import com.ssafy.backend.entity.ItemCode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateDto {

    private String nickname;
    private String password;
    private String profile;
    private ItemCode nameColor;
}