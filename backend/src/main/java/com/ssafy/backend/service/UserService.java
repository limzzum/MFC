package com.ssafy.backend.service;

import com.ssafy.backend.dto.*;
import com.ssafy.backend.entity.*;
import com.ssafy.backend.repository.*;
import lombok.*;
import org.springframework.stereotype.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;

    public Long regist(User user){
        User saved = repository.save(user);
        return saved.getId();
    }

    public Long login(LoginForm loginForm){
        User user = repository.findByEmail(loginForm.getEmail());
        if(user == null){
            return null;
        }
        if(user.getPassword().equals(loginForm.getPassword())){
            return user.getId();
        }
        return null;
    }

    public void logout(Long userId){

    }

    public User findUser(Long id){
        return repository.findById(id).get();
    }

}
