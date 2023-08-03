package com.ssafy.backend.repository;

import com.ssafy.backend.entity.User;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.*;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
    User findByNickname(String nickname);
}
