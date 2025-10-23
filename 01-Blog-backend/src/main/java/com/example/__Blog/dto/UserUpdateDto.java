package com.example.__Blog.dto;

import org.springframework.web.multipart.MultipartFile;

public record UserUpdateDto(
    String username,
    String bio,
    MultipartFile profile
) {}
