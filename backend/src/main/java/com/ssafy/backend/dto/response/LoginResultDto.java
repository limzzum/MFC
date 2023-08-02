package com.ssafy.backend.dto.response;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResultDto {
    private Long userId;
    private String accessToken;

}
