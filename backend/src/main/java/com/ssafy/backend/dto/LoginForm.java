package com.ssafy.backend.dto;

import javax.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginForm {

    @Pattern(regexp = "^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$", message = "올바른 이메일 형식이어야 합니다.")
    private String email;

    @Size(min = 8, max = 30, message = "비밀번호는 8자리 이상 30자리 이하 입니다.")
    @Pattern(regexp = "^.*(?=^.{8,}$)(?=.*\\d)(?=.*[a-zA-Z])(?=.*[!@#$%*^&+=]).*$", message = "영어 소문자와 대문자, 특수문자를 포함해야 합니다.")
    private String password;
}
