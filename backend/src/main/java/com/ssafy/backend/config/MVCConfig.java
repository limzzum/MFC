package com.ssafy.backend.config;

import com.ssafy.backend.interceptor.LoginCheckInterCeptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class MVCConfig implements WebMvcConfigurer {

//    @Override
//    public void addInterceptors(InterceptorRegistry registry) {
//        registry.addInterceptor(loginCheckInterCeptor())
//                .order(1)
//                .addPathPatterns("/**")
//                .excludePathPatterns("/", "/api/user", "/api/user/login", "/api/user/logout/**","/api/user/refresh/**","/api/place/**",
//                        "/**/*.css","/**/*.jpg","/**/*.jpeg","/**/*.png","/**/*.peg", "/**/*.js", "/error/**"
//                    );
//    }
    @Override
    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//            .allowedOrigins("http://localhost:3000", "https://goldenteam.site") // 허용할 출처
//            .allowedMethods("GET", "POST","PATCH","DELETE","PUT") // 허용할 HTTP method'
//            .allowedHeaders("content-type")
//            .allowedHeaders("Authorization")
//            .allowCredentials(true) // 쿠키 인증 요청 허용
//            .maxAge(3000); // 원하는 시간만큼 pre-flight 리퀘스트를 캐싱
    }

    @Bean
    public LoginCheckInterCeptor loginCheckInterCeptor(){
        return new LoginCheckInterCeptor();
    }

//    @Override
//    public void addViewControllers(ViewControllerRegistry registry) {
//        registry.addViewController("/").setViewName("redirect:/api/swagger-ui/index.html");
//    }

}
