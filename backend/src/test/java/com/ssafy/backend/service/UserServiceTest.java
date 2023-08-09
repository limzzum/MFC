package com.ssafy.backend.service;

import com.ssafy.backend.dto.*;
import com.ssafy.backend.dto.request.UserRegistDto;
import com.ssafy.backend.entity.*;
import javax.transaction.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.boot.test.context.*;

@SpringBootTest
@Transactional
class UserServiceTest {

    private final UserService service;

    @Autowired
    UserServiceTest(UserService service) {
        this.service = service;
    }

    @BeforeEach
    void before(){

    }

    @Test
    void regist() {
        UserRegistDto user = UserRegistDto.builder().email("test@samsung.com").nickname("testUser").password("Ssafy123!").build();

        Long savedId = service.regist(user);
        User findUser = service.findById(savedId);

        Assertions.assertEquals(findUser.getPassword(), user.getPassword());
        Assertions.assertEquals(findUser.getEmail(), user.getEmail());
    }

    @Test
    void login() {
        UserRegistDto user = UserRegistDto.builder().email("test@samsung.com").nickname("testUser").password("Ssafy123!").profile(null).build();
        Long savedId = service.regist(user);

        LoginForm success_loginForm = new LoginForm("test@samsung.com", "Ssafy123!");
        LoginForm fail_loginForm = new LoginForm("test@samsung.com", "aaa");
        Long successId = service.login(success_loginForm);
        Long failId = service.login(fail_loginForm);

        Assertions.assertEquals(savedId, successId);
        Assertions.assertNull(failId);

    }

    @Test
    void logout() {
    }
}