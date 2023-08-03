package com.ssafy.backend.config;

import com.ssafy.backend.interceptor.LoginCheckInterCeptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class MVCConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginCheckInterCeptor())
                .order(1)
//                .addPathPatterns("/**")
                .excludePathPatterns("/", "/api/user", "/api/user/login", "/api/user/logout/**","/api/user/refresh/**","/api/place/**",
                        "/**/*.css","/**/*.jpg","/**/*.jpeg","/**/*.png","/**/*.peg", "/**/*.js", "/error/**"
                    );
    }

    @Bean
    public LoginCheckInterCeptor loginCheckInterCeptor(){
        return new LoginCheckInterCeptor();
    }


}
