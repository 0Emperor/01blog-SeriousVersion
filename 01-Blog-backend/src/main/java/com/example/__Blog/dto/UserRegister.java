package com.example.__Blog.dto;


import com.example.__Blog.validation.annotation.ValidPassword;

import jakarta.validation.constraints.NotBlank;

public record UserRegister (
        @NotBlank(message = "username required at register") String username,
        @ValidPassword String password
        ) {
}