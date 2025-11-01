package com.example.__Blog.dto;

import org.springframework.web.multipart.MultipartFile;

import com.example.__Blog.validation.annotation.ValidPassword;
import com.example.__Blog.validation.annotation.ValidUserUpdate;

import jakarta.validation.constraints.NotBlank;

@ValidUserUpdate
public record UserRegister(
        @NotBlank(message = "username required at register") String username,
        @ValidPassword String password,
        String name,
        String bio,
        MultipartFile profile) {
}