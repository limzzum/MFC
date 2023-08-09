package com.ssafy.backend.dto.response;

import com.ssafy.backend.entity.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserInfoDto {
    private Long id;
    private String email;
    private String nickname;
    private String profile;
    private ItemCode colorItem;

}
