package com.ssafy.backend.service;

import com.ssafy.backend.dto.*;
import com.ssafy.backend.entity.*;
import com.ssafy.backend.repository.*;
import java.util.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.boot.test.context.*;

@SpringBootTest
class UserServiceTest {

    private final UserService service;

    @Autowired

    UserServiceTest(UserService service) {
        this.service = service;
    }

    @Test
    void regist() {
        User user = User.builder().email("ssafy@samsung.com").nickname("ssafy").password("alalala").profile(null).isDeleted(false).colorItem(null).build();

        System.out.println(user);
        Long savedId = service.regist(user);

        Assertions.assertEquals(service.findUser(savedId).getId(), user.getId());
        Assertions.assertEquals(service.findUser(savedId).getEmail(), user.getEmail());
    }

    @Test
    void login() {
        User user = User.builder().email("ssafy@samsung.com").nickname("ssafy").password("alalala").profile(null).isDeleted(false).colorItem(null).build();
        Long savedId = service.regist(user);

        LoginForm success_loginForm = new LoginForm("ssafy@samsung.com", "alalala");
        LoginForm fail_loginForm = new LoginForm("ssafy@samsung.com", "aaa");
        Long successId = service.login(success_loginForm);
        Long failId = service.login(fail_loginForm);

        Assertions.assertEquals(savedId, successId);
        Assertions.assertNull(failId);

    }

    @Test
    void logout() {
    }
}