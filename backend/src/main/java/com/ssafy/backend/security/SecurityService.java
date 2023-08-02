package com.ssafy.backend.security;

import com.ssafy.backend.util.RedisUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;
import java.util.Date;

@Service
public class SecurityService {

    @Autowired
    private RedisUtil redisUtil;

    @Value("${jwt.expmin}")
    private Long expireMin;

    @Value("${jwt.key}")
    private String SECRET_KEY;

    public String createRefreshToken(int userNo){
        String refreshToken = create(String.valueOf(userNo), expireMin*1000*60 * 5);
        redisUtil.set(String.valueOf(userNo), refreshToken, (int) (expireMin*5));
        return refreshToken;
    }
    public String createJwtToken(String subject){
        return create(String.valueOf(subject), expireMin*1000*60);
    }

    public String reCreateJwtToken(String refreshToken){
        String key = getSubject(refreshToken);
        if(redisUtil.hasKey(key)){
            System.out.println("유효한 refreshtoken1");
            if(redisUtil.get(key).equals(refreshToken)){
                System.out.println("유효한 refreshtoken2");
                return createJwtToken(key);
            }
        }
        System.out.println("유효하지않은 refreshtoken");
        return null;
    }

    public void deleteUserToken(int userNo){
        redisUtil.delete(String.valueOf(userNo));
    }

    public String create(String subject, long expTime){
        if(expTime<=0){
            throw new RuntimeException("만료시간은 0이상");
        }

        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
        byte[] secretKeyBytes = DatatypeConverter.parseBase64Binary(SECRET_KEY);
        Key signingKey = new SecretKeySpec(secretKeyBytes,signatureAlgorithm.getJcaName());

        return Jwts.builder()
                .setSubject(subject)
                .signWith(signingKey, signatureAlgorithm)
                .setExpiration(new Date(System.currentTimeMillis()+expTime))
                .compact();
    }

    public String getSubject(String token){
        if(redisUtil.hasKeyExcludeList(token)){
            System.out.println("로그아웃함");
            throw new RuntimeException("이미 로그아웃하였습니다");
        }
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(DatatypeConverter.parseBase64Binary(SECRET_KEY))
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }
}
