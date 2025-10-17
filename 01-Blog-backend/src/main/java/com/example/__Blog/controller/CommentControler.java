package com.example.__Blog.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.__Blog.dto.Commentdto;
import com.example.__Blog.helper.CustomUserDetails;
import com.example.__Blog.service.CommentService;

@RestController
@RequestMapping("/api/comment")
public class CommentControler {

    private final CommentService commentService;

    CommentControler(CommentService cmt) {
        commentService = cmt;
    }

    @PostMapping
    public ResponseEntity<Object> AddComment(@AuthenticationPrincipal CustomUserDetails cUserDetails,
            @RequestBody Commentdto cmt) {
        return ResponseEntity.ok().body(
                Commentdto.from(
                        commentService.AddComment(cmt.content(), cmt.pid(), cUserDetails.getId())));
    }
}
