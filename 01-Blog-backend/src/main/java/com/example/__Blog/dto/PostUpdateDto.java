package com.example.__Blog.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Size;

public record PostUpdateDto(
    @Size(min = 10, max = 4748,message = "chabach") String description,
    @Size(min = 3, max = 17,message = "chob") String title,
    List<String> keepMedia,      
    List<MultipartFile> newMedia 
) {}