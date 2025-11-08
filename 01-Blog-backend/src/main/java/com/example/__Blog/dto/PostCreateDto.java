package com.example.__Blog.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Size;

public record PostCreateDto(
    @Size(min = 10, max = 4748,message = "chob") String description,
    @Size(min = 3, max = 17, message = "chabach") String title,
    List<MultipartFile> newMedia
) {}