package com.ssafy.backend.controller;

import com.ssafy.backend.dto.*;
import com.ssafy.backend.dto.request.*;
import com.ssafy.backend.dto.response.*;
import com.ssafy.backend.entity.*;
import com.ssafy.backend.security.*;
import com.ssafy.backend.service.*;
import java.util.*;

import javax.validation.*;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.*;
import org.springframework.http.*;
import org.springframework.validation.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
@Slf4j
@Api(tags = "USER REST API")
public class UserController {

    private final UserService userService;
    private final SecurityService securityService;
    private final EmailService emailService;
    private final ItemService itemService;

    @ApiOperation(value = "로그인 요청", notes = "로그인에 성공하면 jwt토큰을 발급, 실패하면 실패메시지 반환",response = Map.class)
    @PostMapping("/login")
    public Message login(@RequestBody @Valid LoginForm loginForm, BindingResult result) {
        if (result.hasErrors()) {
            return new Message(HttpStatus.BAD_REQUEST, "로그인 형식이 올바르지 않습니다.", null);
        }

        Long loginId = userService.login(loginForm);
        if (loginId == null) {
            return new Message(HttpStatus.OK, "일치하는 사용자가 없습니다.", null);
        }
        String jwtToken = securityService.createJwtToken(String.valueOf(loginId));
        return new Message(HttpStatus.OK, "로그인 성공", new LoginResultDto(loginId, jwtToken));
    }

    @GetMapping("/logout")
    public ResponseEntity<Message> logout(@RequestHeader("Authorization") String token) {
        Long userId = Long.valueOf(securityService.getSubject(token));
        securityService.logout(userId, token);
        return ResponseEntity.ok(new Message(HttpStatus.OK, "로그아웃 성공", null));
    }

//    @PostMapping
//    public ResponseEntity<Message> regist(@RequestBody @Valid UserRegistDto user,
//        BindingResult result) {
//        if (result.hasErrors()) {
//            return ResponseEntity.ok(new Message(HttpStatus.BAD_REQUEST, "입력값이 올바르지 않습니다.", null));
//        }
//        String email = user.getEmail();
//        String token = UUID.randomUUID().toString();
//        emailService.saveToken(email, token, user);
//
//        Random r = new Random();
//        int checkNum = r.nextInt(888888) + 111111;
//
//        String message = "Please click the following link to verify your email: " +
//            "<a href='http://i9a605.p.ssafy.io:8081/api/user/verify?email=" + email + "&token="
//            + token + "'>Verify</a>";
//        emailService.sendMail(user.getEmail(), "Please verify your email", message);
//        return ResponseEntity.ok(new Message(HttpStatus.ACCEPTED, "이메일 인증번호를 발송하였습니다.", null));
//
//    }

    @PostMapping
    public ResponseEntity<Message> regist2(@RequestBody @Valid UserRegistDto user,
        BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.ok(new Message(HttpStatus.BAD_REQUEST, "입력값이 올바르지 않습니다.", null));
        }
        String email = user.getEmail();
        if(emailService.isEqualsEmailNum(email, user.getEmailNum())){
            Long savedId = userService.regist(user);
            return ResponseEntity.ok(new Message(HttpStatus.OK, "회원가입 성공", savedId));
        }

        return ResponseEntity.ok(new Message(HttpStatus.BAD_REQUEST, "회원가입 실패", null));

    }
    @GetMapping("/email/verify")
    public ResponseEntity<Message> email_num(@RequestParam String email){
        Random r = new Random();
        int checkNum = r.nextInt(888888) + 111111;
        emailService.saveEmailNum(email, checkNum);
        String message =  "인증 번호는 " + checkNum + "입니다." +
            "<br>" +
            "해당 인증번호를 인증번호 확인란에 기입하여 주세요.";
        emailService.sendMail(email, "Please verify your email", message);
        return ResponseEntity.ok(new Message(HttpStatus.ACCEPTED, "이메일 인증번호를 발송하였습니다.", null));
    }

    @PostMapping("/email/verify")
    public ResponseEntity<Message> email_num_check(@RequestBody EmailNumDto emailNumDto){
        System.out.println(emailNumDto.getEmail()+" "+emailNumDto.getNum());
        if(emailService.isEqualsEmailNum(emailNumDto.getEmail(), emailNumDto.getNum())){
            return ResponseEntity.ok(new Message(HttpStatus.ACCEPTED, "이메일 인증 성공", null));
        }
        return ResponseEntity.ok(new Message(HttpStatus.BAD_REQUEST, "이메일 인증 실패", null));
    }

    @GetMapping("/verify")
    public ResponseEntity<Message> email_verify(@RequestParam String email,
        @RequestParam String token) {
        String emailToken = emailService.getEmailToken(email);
        if (emailToken.equals(token)) {
            UserRegistDto user = emailService.getRegistUserInfo(emailToken);
            Long savedId = userService.regist(user);
            return ResponseEntity.ok(new Message(HttpStatus.OK, "회원가입 성공", savedId));
        }
        return ResponseEntity.ok(new Message(HttpStatus.BAD_REQUEST, "회원가입 실패", null));

    }

    @GetMapping
    public ResponseEntity<Message> info(@RequestHeader("Authorization") String token) {
        System.out.println(securityService.getSubject(token));
        Long userId = Long.valueOf(securityService.getSubject(token));
        User user = userService.findUser(userId);

        return ResponseEntity.ok(new Message(HttpStatus.OK, "success", user));
    }

    @PatchMapping
    public ResponseEntity<Message> modify(@RequestHeader("Authorization") String token,
                                          @RequestBody UserUpdateDto userUpdateDto) {
        Long userId = Long.valueOf(securityService.getSubject(token));
        userService.modify(userId, userUpdateDto, userUpdateDto.getNameColorId());
        return ResponseEntity.ok(new Message(HttpStatus.OK, "수정 완료", null));
    }

    @DeleteMapping
    public ResponseEntity<Message> delete(@RequestHeader("Authorization") String token) {
        Long userId = Long.valueOf(securityService.getSubject(token));
        Long delete = userService.delete(userId);

        return ResponseEntity.ok(new Message(HttpStatus.OK, "success", delete));
    }

    @GetMapping("/email")
    public ResponseEntity<Message> email_check(@RequestParam String email) {
        if (userService.isUsedEmail(email)) {
            return ResponseEntity.ok(new Message(HttpStatus.BAD_REQUEST, "이미 사용중인 이메일입니다.", null));
        }
        return ResponseEntity.ok(new Message(HttpStatus.ACCEPTED, "사용가능한 이메일 입니다.", null));
    }


    @GetMapping("/nickname")
    public ResponseEntity<Message> nickname_check(@RequestParam String nickname) {
        if(userService.isUsedNickname(nickname)){
            return ResponseEntity.ok(new Message(HttpStatus.BAD_REQUEST, "이미 사용중인 닉네임입니다.",null));
        }
        return ResponseEntity.ok(new Message(HttpStatus.ACCEPTED, "사용가능한 닉네임 입니다.",null));
    }

    @GetMapping("/test")
    public String test() {
        String jwtToken = securityService.createJwtToken("1");
        return jwtToken;
    }

}
