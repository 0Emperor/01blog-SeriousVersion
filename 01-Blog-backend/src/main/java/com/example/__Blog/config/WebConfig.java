package com.example.__Blog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // @Autowired
    // JwtInterceptor jwtInterceptor;

    // @Override
    // public void addInterceptors(InterceptorRegistry registry) {
    // registry.addInterceptor(jwtInterceptor).addPathPatterns("/api/**").excludePathPatterns("/api/users/register")
    // .excludePathPatterns("/api/users/login");
    // }
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
                registry.addMapping("/access/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("GET")
                        .allowedHeaders("*")
                        .allowCredentials(true);
                registry.addMapping("/auth/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("GET", "POST")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
