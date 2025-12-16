package com.example.__Blog.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Size;

public record PostCreateDto(
        @Size(min = 10, max = 4748, message = "Description must be between 10 and 4748 characters") String description,
        @Size(min = 3, max = 17, message = "Title must be between 3 and 17 characters") String title,
        List<MultipartFile> newMedia) {
}