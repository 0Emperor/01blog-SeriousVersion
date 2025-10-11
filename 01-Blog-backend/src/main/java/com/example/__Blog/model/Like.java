package com.example.__Blog.model;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "likes")
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
public void setPost(Post post) {
    this.post = post;
}
public void setUser(User user) {
    this.user = user;
}public Post getPost() {
    return post;
}
public Integer getId() {
    return id;
}

    private Date createdAt;
    public Date getCreatedAt() {
        return createdAt;
    }
    public User getUser() {
        return user;
    }
}
