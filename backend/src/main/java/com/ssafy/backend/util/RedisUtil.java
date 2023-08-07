package com.ssafy.backend.util;

import com.ssafy.backend.dto.request.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class RedisUtil {

    private final RedisTemplate<String, Object> redisTemplate;
    private final RedisTemplate<String, Object> redisBlackListTemplate;
    private final RedisTemplate<String, Object> emailTokenTemplate;
    private final RedisTemplate<String, Object> registUserTemplate;
    private final RedisTemplate<String, Object> emailNumTemplate;


    @Value("${jwt.expmin}")
    private int expMin;

    public void set(String key, Object o, int minutes) {
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer(o.getClass()));
        redisTemplate.opsForValue().set(key, o, minutes, TimeUnit.MINUTES);
    }

    public Object get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public boolean delete(String key) {
        return Boolean.TRUE.equals(redisTemplate.delete(key));
    }

    public boolean hasKey(String key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    public void setExcludeList(String key, Object o) {
        redisBlackListTemplate.setValueSerializer(new Jackson2JsonRedisSerializer(o.getClass()));
        redisBlackListTemplate.opsForValue().set(key, o, expMin, TimeUnit.MINUTES);
    }

    public Object getExcludeList(String key) {
        return redisBlackListTemplate.opsForValue().get(key);
    }

    public boolean deleteExcludeList(String key) {
        return Boolean.TRUE.equals(redisBlackListTemplate.delete(key));
    }

    public boolean hasKeyExcludeList(String key) {
        return Boolean.TRUE.equals(redisBlackListTemplate.hasKey(key));
    }

    public void setEmailTokenTemplate(String key, Object o, int minutes) {
        emailTokenTemplate.setValueSerializer(new Jackson2JsonRedisSerializer(o.getClass()));
        emailTokenTemplate.opsForValue().set(key, o, minutes, TimeUnit.MINUTES);
    }

    public Object getTokenByEmail(String key) {
        emailTokenTemplate.setValueSerializer(new Jackson2JsonRedisSerializer(String.class));
        return emailTokenTemplate.opsForValue().get(key);
    }

    public boolean hasKeyEmail(String key) {
        return Boolean.TRUE.equals(emailTokenTemplate.hasKey(key));
    }

    public void setRegistUserTemplate(String key, Object o, int minutes) {
        registUserTemplate.setValueSerializer(new Jackson2JsonRedisSerializer(o.getClass()));
        registUserTemplate.opsForValue().set(key, o, minutes, TimeUnit.MINUTES);
    }

    public UserRegistDto getRegistUserInfo(String key) {
        registUserTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(UserRegistDto.class));
        return (UserRegistDto) registUserTemplate.opsForValue().get(key);
    }

    public void setEmailNumTemplate(String key, Object o, int minutes) {
        emailNumTemplate.setValueSerializer(new Jackson2JsonRedisSerializer(o.getClass()));
        emailNumTemplate.opsForValue().set(key, o, minutes, TimeUnit.MINUTES);
    }

    public int getNumByEmail(String key) {
        emailNumTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(int.class));
        return (int) emailNumTemplate.opsForValue().get(key);
    }
}