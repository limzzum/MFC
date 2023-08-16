package com.ssafy.backend.controller;

import com.ssafy.backend.dto.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/error")
public class ErrorController {

    @GetMapping("/login")
    public ResponseEntity<Message> login(){
        return ResponseEntity.ok(new Message(HttpStatus.BAD_REQUEST,"인증되지 않은 사용자입니다.",null));
    }

    @GetMapping("/token")
    public ResponseEntity<Message> accessToken(){
        return ResponseEntity.ok(new Message(HttpStatus.BAD_REQUEST, "토큰이 만료되었습니다", null));
    }
}
