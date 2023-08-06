package com.ssafy.backend.dto.request;

import lombok.AllArgsConstructor;
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
    private Long nameColorId;
}