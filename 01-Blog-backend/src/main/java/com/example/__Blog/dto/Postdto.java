package com.example.__Blog.dto;

import java.sql.Timestamp;
import java.util.UUID;
import com.example.__Blog.model.Post;

public record Postdto(
                String postId,
                String description,
                String title,
                Timestamp createdAt,
                Userdto user,
                boolean isLiked,
                int totalLikes,
                boolean isOwn,
                int commentsCount) {
        public static Postdto from(Post post,
                        UUID currentUserId,
                        int totalLikes,
                        int totalComments,
                        boolean isLiked) {

                Userdto summary = new Userdto(
                                post.getUser().getId().toString(),
                                post.getUser().getUsername(),
                                post.getUser().getRole(),
                                post.getUser().getBio(),
                                post.getUser().getProfile());

                return new Postdto(
                                post.getId().toString(),
                                post.getDescription(),
                                post.getTitle(),
                                post.getCreatedAt(),
                                summary,
                                isLiked,
                                totalLikes,
                                post.getUser().getId().equals(currentUserId),
                                totalComments);
        }
}