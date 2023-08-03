package com.ssafy.backend.service;

import com.ssafy.backend.dto.LoginForm;
import com.ssafy.backend.dto.request.UserRegistDto;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository repository;

  public Long regist(UserRegistDto user) {
    User registUser = User.builder().email(user.getEmail()).nickname(user.getNickname())
        .password(user.getPassword())
        .isDeleted(false).colorItem(null).profile(user.getProfile()).build();
    User saved = repository.save(registUser);
    return saved.getId();
  }

  public Long login(LoginForm loginForm) {
    User user = repository.findByEmail(loginForm.getEmail());
    if (user == null) {
      return null;
    }
    if (user.getPassword().equals(loginForm.getPassword())) {
      return user.getId();
    }
    return null;
  }

  public void logout(Long userId) {

  }

  public User findUser(Long id) {
    return repository.findById(id).orElseGet(null);
  }

  public User findById(Long id) {
    if(repository.findById(id).isEmpty())
      return null;
    else
      return repository.findById(id).get();
  }

}
