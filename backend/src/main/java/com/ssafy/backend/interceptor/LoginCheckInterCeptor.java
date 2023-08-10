package com.ssafy.backend.interceptor;

import com.ssafy.backend.security.*;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
public class LoginCheckInterCeptor implements HandlerInterceptor {

    @Autowired
    private SecurityService securityService;

    @Override
    public boolean preHandle( HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        String path = request.getRequestURL().substring(request.getRequestURL().lastIndexOf("/")+1);
        if(path.equals("user") && request.getMethod().equals("POST")){
            return true;
        }
        String accessToken = request.getHeader("Authorization");

        if(accessToken == null){
            log.info("미인증 사용자 요청");
            response.sendRedirect("/error/login");
            return false;
        }
        try{
            String subject = securityService.getSubject(accessToken);
            log.info(subject);
            return true;
        }catch (ExpiredJwtException e){
            e.printStackTrace();
            response.sendRedirect("/error/access-token");
            return false;
        }catch (Exception e){
            e.printStackTrace();
            response.sendRedirect("/error/login");
        }

        return false;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
    }
}
