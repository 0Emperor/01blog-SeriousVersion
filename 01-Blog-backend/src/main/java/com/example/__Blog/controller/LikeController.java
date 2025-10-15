package com.example.__Blog.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.__Blog.helper.CustomUserDetails;
import com.example.__Blog.service.LikeService;

@RestController
@RequestMapping("/api/like")
public class LikeController {
    private final LikeService likeService;

    LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping("/{postId}")
    public ResponseEntity<?> likePost(@PathVariable Integer postId, @AuthenticationPrincipal CustomUserDetails jwt) {
        likeService.likePost(jwt.getId(), postId);
        return ResponseEntity.ok().body(true);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> unlikePost(@PathVariable Integer postId, @AuthenticationPrincipal CustomUserDetails jwt) {
        likeService.unlikePost(jwt.getId(), postId);
        return ResponseEntity.ok().body(false);
    }

}
