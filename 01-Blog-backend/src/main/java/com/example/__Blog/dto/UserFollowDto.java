package com.example.__Blog.dto;

import java.util.UUID;

public record UserFollowDto(
        UUID userId,
        String username,
        String profilePictureUrl,
        boolean isFollowing) {
}
