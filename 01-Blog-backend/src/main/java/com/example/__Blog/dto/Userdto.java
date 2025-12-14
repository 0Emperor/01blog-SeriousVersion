package com.example.__Blog.dto;

import com.example.__Blog.model.User;

public record Userdto(
        String id,
        String username,
        String name,
        String role,
        String bio,
        String profile,
        boolean isBaned,
        java.sql.Timestamp createdAt) {
    public static Userdto from(User user) {
        return new Userdto(
                user.getId().toString(),
                user.getUsername(),
                user.getName(),
                user.getRole(),
                user.getBio(),
                user.getProfile(),
                user.getBaned(),
                user.getCreated_at());
    }
}