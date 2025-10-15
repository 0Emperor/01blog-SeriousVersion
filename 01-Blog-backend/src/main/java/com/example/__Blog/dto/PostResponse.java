package com.example.__Blog.dto;

import java.sql.Timestamp;
import java.util.UUID;

import com.example.__Blog.model.Post;
import com.example.__Blog.service.LikeService;

public class PostResponse {
    private String postId;
    private String description;
    private String title;
    private Timestamp createdAt;
    private UserSummary user;
    private boolean isLiked = true;
    private Integer totalLikes = 0;
    private boolean isOwn;
    private Integer commentsCount;
    public Integer getCommentsCount() {
        return commentsCount;
    }

    public Integer gettotalLikes() {
        return totalLikes;
    }

    public boolean getIsOwn() {
        return isOwn;
    }

    public PostResponse(String postId, String description, String title, Timestamp createdAt, UserSummary user,
            Integer totalLikes, Integer commentCount, UUID id, Boolean isLiked) {
        this.isOwn = (UUID.fromString(user.getId()).equals(id));
        this.commentsCount = commentCount;
        this.totalLikes = totalLikes;
        this.postId = postId;
        this.description = description;
        this.title = title;
        this.createdAt = createdAt;
        this.user = user;
        this.isLiked = isLiked;
    }

    public void setLiked(boolean isLiked) {
        this.isLiked = isLiked;
    }

    public boolean getisLiked() {
        return isLiked;
    }

    public String getPostId() {
        return postId;
    }

    public String getDescription() {
        return description;
    }

    public String getTitle() {
        return title;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public UserSummary getUser() {
        return user;
    }

    public static PostResponse mapToDto(Post post, UUID id,Integer tLikes,Integer Tcomments,boolean isLiked) {
        PostResponse.UserSummary userSummary = new PostResponse.UserSummary(
                post.getUser().getId().toString(),
                post.getUser().getUsername(),
                post.getUser().getRole(),
                post.getUser().getBio(),
                post.getUser().getProfile());

        return new PostResponse(
                post.getId().toString(),
                post.getDescription(),
                post.getTitle(),
                post.getCreatedAt(),
                userSummary,
                tLikes,Tcomments ,id, isLiked);
    }

    public static class UserSummary {
        private String id;
        private String username;
        private String role;
        private String bio;
        private String profile;

        public UserSummary(String id, String username, String role, String bio, String profile) {
            this.id = id;
            this.username = username;
            this.role = role;
            this.bio = bio;
            this.profile = profile;
        }

        public String getId() {
            return id;
        }

        public String getUsername() {
            return username;
        }

        public String getRole() {
            return role;
        }

        public String getBio() {
            return bio;
        }

        public String getProfile() {
            return profile;
        }
    }
}
