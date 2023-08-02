package com.ssafy.backend.controller;

import com.ssafy.backend.dto.*;
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
public class UserController {

    private final UserService service;

    @PostMapping("/login")
    public ResponseDto login(@RequestBody @Valid LoginForm loginForm, BindingResult result){
        if(result.hasErrors()){
            return new ResponseDto("로그인 형식이 올바르지 않습니다.", HttpStatus.BAD_REQUEST);
        }

        Long loginId = service.login(loginForm);
        if(loginId == null){
            return new ResponseDto("일치하는 사용자가 없습니다.", HttpStatus.OK);
        }
        return new ResponseDto(loginId, HttpStatus.OK);
    }

    @PostMapping
    public ResponseDto regist(@RequestBody @Valid UserRegistDto user, BindingResult result){
        if(result.hasErrors()){
            return new ResponseDto("입력값이 올바르지 않습니다.", HttpStatus.BAD_REQUEST);
        }

        Long savedId = service.regist(user);
        return new ResponseDto(savedId, HttpStatus.OK);
    }

}
