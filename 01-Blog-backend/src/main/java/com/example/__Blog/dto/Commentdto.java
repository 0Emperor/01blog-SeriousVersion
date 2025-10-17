package com.example.__Blog.dto;

import java.sql.Timestamp;

import com.example.__Blog.model.Comment;

public record Commentdto(
        Integer pid,
        Integer id,
        String content,
        Userdto user,
        Timestamp createdAt) {
    public static Commentdto from(Comment cmt) {
        return new Commentdto(
                cmt.getPost().getId(),
                cmt.getId(),
                cmt.getText(),
                Userdto.from(cmt.getUser()),
                cmt.getCreatedAt());
    }
}