package com.example.__Blog.dto;

import java.sql.Date;

import com.example.__Blog.model.Post;

public class PostResponse {
    private String postId;
    private String description;
    private String title;
    private Date createdAt;
    private UserSummary user;
    private boolean liked=false;
    public PostResponse(String postId, String description, String title, Date createdAt, UserSummary user) {
        this.postId = postId;
        this.description = description;
        this.title = title;
        this.createdAt = createdAt;
        this.user = user;
    }
public void setLiked(boolean liked) {
    this.liked = liked;
}

public boolean getLiked() { return liked; }
    public String getPostId() { return postId; }
    public String getDescription() { return description; }
    public String getTitle() { return title; }
    public Date getCreatedAt() { return createdAt; }
    public UserSummary getUser() { return user; }
    public static PostResponse mapToDto(Post post) {
        PostResponse.UserSummary userSummary = new PostResponse.UserSummary(
                post.getUser().getId().toString(),
                post.getUser().getUsername(),
                post.getUser().getRole(),
                post.getUser().getBio(),
                post.getUser().getProfile()
        );

        return new PostResponse(
                post.getId().toString(),
                post.getDescription(),
                post.getTitle(),
                post.getCreatedAt(),
                userSummary
        );
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

        public String getId() { return id; }
        public String getUsername() { return username; }
        public String getRole() { return role; }
        public String getBio() { return bio; }
        public String getProfile() { return profile; }
    }
}
