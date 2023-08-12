package com.ssafy.backend.service;

import com.ssafy.backend.dto.LoginForm;
import com.ssafy.backend.dto.Message;
import com.ssafy.backend.dto.request.*;
import com.ssafy.backend.dto.response.*;
import com.ssafy.backend.entity.History;
import com.ssafy.backend.entity.ItemCode;
import com.ssafy.backend.entity.UploadFile;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.file.FileStore;
import com.ssafy.backend.repository.HistoryRepository;
import com.ssafy.backend.repository.ItemCodeRepository;
import com.ssafy.backend.repository.UploadFileRepository;
import com.ssafy.backend.repository.UserRepository;

import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final HistoryRepository historyRepository;
    private final ItemCodeRepository itemCodeRepository;
    private final UploadFileRepository uploadFileRepository;
    private final FileStore fileStore;

    public Long regist(UserRegistDto user) {
        ItemCode itemcode = itemCodeRepository.findById(1L).orElse(null);
        User registUser = User.builder().email(user.getEmail()).nickname(user.getNickname())
                 .password(user.getPassword())
                 .colorItem(itemcode)
                .build();
        User saved = repository.save(registUser);
        History history = History.builder()
            .user(saved)
            .coin(0)
            .experience(0)
            .build();
        historyRepository.save(history);
        return saved.getId();
    }

    public void profileUpload(Long userId, UploadFile uploadFile){
            UploadFile saveImage = uploadFileRepository.save(uploadFile);
            User user = repository.findById(userId).orElse(null);
            user.setProfile(saveImage.getFilePath());
    }

    public Long login(LoginForm loginForm) {
        Optional<User> user = repository.findByEmail(loginForm.getEmail());
        if (!user.isPresent()) {
            return null;
        }

        if (user.get().getPassword().equals(loginForm.getPassword())) {
            return user.get().getId();
        }
        return null;
    }

    public void logout(Long userId) {

    }
    public void modify(Long id, UserUpdateDto userUpdateDto, Long itemCodeId) {
        User findUser = findById(id);
        if(findUser == null){
            return;
        }
        ItemCode itemCode = new ItemCode(itemCodeId);
        findUser.updateInfo(userUpdateDto,itemCode);
    }

    public Long delete(Long id) {
        User findUser = repository.findById(id).orElse(null);
        if(findUser == null){
            return null;
        }
        findUser.signout();
        return id;
    }

    public UserInfoDto getUserInfo(Long id) {
        User user = repository.findById(id).orElse(null);
        UserInfoDto userInfoDto = UserInfoDto.builder()
                                        .id(user.getId())
                                        .email(user.getEmail())
                                        .nickname(user.getNickname())
                                        .profile(user.getProfile())
                                        .colorItem(user.getColorItem()).build();
        return userInfoDto;
    }

    public User findById(Long id) {
        if (repository.findById(id).isEmpty())
            return null;
        else
            return repository.findById(id).get();
    }

    public Message userItemCodeUpdate(Long userId, ItemCode itemCode) {
        Message message = new Message();
        Optional<User> userOP = repository.findById(userId);
        if (userOP.isPresent()) {
            User user = userOP.get();
            if (itemCode.equals(user.getColorItem())) {
                message.setData(HttpStatus.BAD_REQUEST);
                message.setMessage("유저가 이미 해당 아이템을 보유하고 있습니다.");
            } else {
                History history = historyRepository.findTopByUserId(userId);
                if (history == null) {
                    message.setStatus(HttpStatus.BAD_REQUEST);
                    message.setMessage("해당 유저의 전적을 찾을 수 없습니다.");
                } else {
                    int userCoin = history.getCoin() - itemCode.getPrice();
                    if (userCoin < 0) {
                        message.setStatus(HttpStatus.BAD_REQUEST);
                        message.setMessage("유저의 코인이 부족해 아이템을 구매할 수 없습니다.");
                    } else {
                        history.setCoin(userCoin);
                        historyRepository.save(history);
                        user.setColorItem(itemCode);
                        repository.save(user);
                        message.setStatus(HttpStatus.OK);
                        message.setMessage("유저의 닉네임 커스팀이 변경되었습니다.");
                    }
                }
            }
        } else {
            message.setStatus(HttpStatus.BAD_REQUEST);
            message.setMessage("해당 유저를 찾을 수 없습니다.");
        }
        return message;
    }

    public boolean isUsedEmail(String email) {
        Optional<User> byEmail = repository.findByEmail(email);
        if (byEmail.isPresent()) {
            return true;
        }
        return false;
    }

    public boolean isUsedNickname(String nickname) {
        Optional<User> user = repository.findByNickname(nickname);
        if (user.isPresent()) {
            return true;
        }
        return false;
    }


//  public User findByNickname(String nickname) {
//    if(repository.findById(nickname).isEmpty())
//      return null;
//    else
//      return repository.findById(id).get();
//  }

}
