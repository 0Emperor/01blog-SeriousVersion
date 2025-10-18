package com.example.__Blog.dto;

import java.sql.Timestamp;
import java.util.UUID;

import com.example.__Blog.model.Comment;

public record Commentdto(
        Integer pid,
        Integer id,
        String content,
        Userdto user,
        Timestamp createdAt,
        boolean isOwn) {
    public static Commentdto from(Comment cmt, UUID id) {
        return new Commentdto(
                cmt.getPost().getId(),
                cmt.getId(),
                cmt.getText(),
                Userdto.from(cmt.getUser()),
                cmt.getCreatedAt(),
                cmt.getUser().getId() == id);
    }
}