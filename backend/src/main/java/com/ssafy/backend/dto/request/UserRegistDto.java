package com.ssafy.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRegistDto {

    @Pattern(regexp = "^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$", message = "올바른 이메일 형식이어야 합니다.")
    String email;

    @Size(min = 2, max = 20)
    String nickname;

    @Size(min = 8, max = 30, message = "비밀번호는 8자리 이상 30자리 이하 입니다.")
    @Pattern(regexp = "^.*(?=^.{8,}$)(?=.*\\d)(?=.*[a-zA-Z])(?=.*[!@#$%*^&+=]).*$", message = "영어 소문자와 대문자, 특수문자를 포함해야 합니다.")
    String password;

    String profile;
}
