package com.ssafy.backend.service;

import com.ssafy.backend.dto.request.UserRegistDto;
import com.ssafy.backend.util.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;


@Service
@Transactional
public class EmailService {

    private final JavaMailSender mailSender;
    private final RedisUtil redisUtil;

    @Autowired
    public EmailService(JavaMailSender mailSender, RedisUtil redisUtil) {
        this.mailSender = mailSender;
        this.redisUtil = redisUtil;
    }

    public void sendMail(String to, String subject, String content) {
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
            messageHelper.setFrom("chfhddl1234@naver.com");
            messageHelper.setTo(to);
            messageHelper.setSubject(subject);
            messageHelper.setText(content, true);
        };
        mailSender.send(messagePreparator);
    }

    public void saveToken(String email, String token, UserRegistDto user){
        redisUtil.setEmailTokenTemplate(email, token, 5);
        redisUtil.setRegistUserTemplate(token, user, 5);
    }

    public void saveEmailNum(String email, int randomNum){
        redisUtil.setEmailNumTemplate(email, randomNum, 15);
    }
    public boolean isEqualsEmailNum(String email, int randomNum){
        if(redisUtil.getNumByEmail(email) == randomNum){
            return true;
        }
        return false;
    }

    public String getEmailToken(String email){
        return (String) redisUtil.getTokenByEmail(email);
    }

    public UserRegistDto getRegistUserInfo(String token){
        return redisUtil.getRegistUserInfo(token);
    }

}
