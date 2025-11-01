package com.example.__Blog.dto;

import com.example.__Blog.validation.annotation.ValidUserLogin;

@ValidUserLogin
public record UserLogindto(
        String username,
        String password) {
}
