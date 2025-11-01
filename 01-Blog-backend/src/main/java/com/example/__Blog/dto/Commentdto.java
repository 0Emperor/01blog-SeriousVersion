package com.example.__Blog.dto;

import java.sql.Timestamp;
import java.util.UUID;

import com.example.__Blog.model.Comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record Commentdto(
        Integer pid,
        Integer id,
        @NotBlank(message = "comment cant be empty") @Size(max=38 ,message="comment cant exced 38 characters")
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
                cmt.getUser().getId().equals(id));
    }
}