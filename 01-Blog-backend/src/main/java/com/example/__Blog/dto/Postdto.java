package com.example.__Blog.dto;

import java.sql.Timestamp;
import java.util.UUID;
import com.example.__Blog.model.Post;
import com.example.__Blog.model.User;

import jakarta.validation.constraints.Size;

public record Postdto(
                String postId,
                @Size(min = 10,message="post content cant be less than 10 characters")
                @Size(max = 4748,message="post content cant exced 4748 characters")
                String description,
                @Size(min = 3,message="post title cant be less than 3 characters")
                @Size(max = 17,message="post title cant exced 17 characters")
                String title,
                Timestamp createdAt,
                Userdto user,
                boolean isLiked,
                int totalLikes,
                boolean isOwn,
                boolean hidden,
                String[] media,
                int commentsCount) {
        public static Postdto from(Post post,
                        UUID currentUserId,
                        int totalLikes,
                        int totalComments,
                        boolean isLiked) {
                
                Userdto summary =Userdto.from(post.getUser());

                return new Postdto(
                                post.getId().toString(),
                                post.getDescription(),
                                post.getTitle(),
                                post.getCreatedAt(),
                                summary,
                                isLiked,
                                totalLikes,
                                post.getUser().getId().equals(currentUserId),
                                post.getHidden(),
                                post.getMedia(),
                                totalComments);
        }

        public static Postdto from(Post post) {

                Userdto summary =Userdto.from(post.getUser());
                return new Postdto(
                                post.getId().toString(),
                                post.getDescription(),
                                post.getTitle(),
                                post.getCreatedAt(),
                                summary,
                                false,
                                0,
                                false,
                                post.getHidden(),
                                post.getMedia(),
                                0);
        }

}