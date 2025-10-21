package com.example.__Blog.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.__Blog.helper.CustomUserDetails;
import com.example.__Blog.service.FollowService;

@RestController
@RequestMapping("/api/follow/")
public class FollowController {
    private final FollowService fService;

    FollowController(FollowService fs) {
        fService = fs;
    }

    @PostMapping("/{id}")
    public ResponseEntity<Object> follow(@AuthenticationPrincipal CustomUserDetails cu,
            @PathVariable UUID id) {
        fService.follow(cu.getId(), id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> unfollow(@AuthenticationPrincipal CustomUserDetails cu,
            @PathVariable UUID id) {
        fService.unfollow(cu.getId(), id);
        return ResponseEntity.ok().build();
    }
}
