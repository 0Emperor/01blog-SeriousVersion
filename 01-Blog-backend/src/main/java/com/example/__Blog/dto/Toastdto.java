package com.example.__Blog.dto;

public record Toastdto(
        String title,
        String message,
        type type) {

    public enum type {
        success,
        error,
        info,
        warning
    }
}
