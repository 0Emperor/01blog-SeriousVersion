package com.example.__Blog.dto;

import org.springframework.web.multipart.MultipartFile;

import com.example.__Blog.validation.annotation.ValidUserUpdate;

@ValidUserUpdate
public record UserUpdateDto(
                String username,
                String name,
                String bio,
                MultipartFile profile)  {
}
