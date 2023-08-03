package com.ssafy.backend.controller;

import com.ssafy.backend.dto.*;
import com.ssafy.backend.dto.response.*;
import com.ssafy.backend.security.*;
import javax.validation.*;

import com.ssafy.backend.dto.request.UserRegistDto;
import com.ssafy.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.*;
import org.springframework.http.HttpStatus;
import org.springframework.validation.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
@Slf4j
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController {

    private final UserService userService;
    private final SecurityService securityService;

    @PostMapping("/login")
    public Message login(@RequestBody @Valid LoginForm loginForm, BindingResult result){
        if(result.hasErrors()){
            return new Message(HttpStatus.BAD_REQUEST, "로그인 형식이 올바르지 않습니다.", null);
        }

        Long loginId = userService.login(loginForm);
        if(loginId == null){
            return new Message(HttpStatus.OK, "일치하는 사용자가 없습니다.", null);
        }
        String jwtToken = securityService.createJwtToken(String.valueOf(loginId));
        return new Message(HttpStatus.OK, "로그인 성공", new LoginResultDto(loginId,jwtToken));
    }

    @PostMapping
    public Message regist(@RequestBody @Valid UserRegistDto user, BindingResult result){
        if(result.hasErrors()){
            return new Message( HttpStatus.BAD_REQUEST, "입력값이 올바르지 않습니다.", null);
        }

        Long savedId = userService.regist(user);
        return new Message( HttpStatus.OK, "회원가입 성공", savedId);
    }


}
