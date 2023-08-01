package com.ssafy.backend.controller;

import com.ssafy.backend.dto.*;
import javax.validation.*;
import lombok.extern.slf4j.*;
import org.springframework.validation.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@Slf4j
public class UserController {

    @PostMapping("/login")
    public ResponseDto login(@RequestBody @Valid LoginForm loginForm, BindingResult result){
        if(result.hasErrors()){
            return new ResponseDto(null);
        }
        return new ResponseDto(loginForm);
    }

}
