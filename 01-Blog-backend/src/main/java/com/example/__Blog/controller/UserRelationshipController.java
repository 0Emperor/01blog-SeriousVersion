package com.example.__Blog.controller;

import com.example.__Blog.dto.UserFollowDto;
import com.example.__Blog.helper.CustomUserDetails;
import com.example.__Blog.service.SubscriptionService;
import com.example.__Blog.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserRelationshipController {

    private final SubscriptionService subscriptionService;

    private final UserService userService;

    public UserRelationshipController(SubscriptionService subscriptionService, UserService userService) {
        this.subscriptionService = subscriptionService;
        this.userService = userService;
    }

    @GetMapping("/{username}/following")
    public Page<UserFollowDto> getFollowing(
            @PathVariable String username,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String query,
            @AuthenticationPrincipal CustomUserDetails currentUser,
            Pageable pageable) {
        UUID currentUserId = currentUser != null ? currentUser.getId() : null;
        UUID targetUserId = userService.getUser(username).getId();
        return subscriptionService.getFollowing(targetUserId, currentUserId, query, pageable);
    }

    @GetMapping("/{username}/followers")
    public Page<UserFollowDto> getFollowers(
            @PathVariable String username,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String query,
            @AuthenticationPrincipal CustomUserDetails currentUser,
            Pageable pageable) {
        UUID currentUserId = currentUser != null ? currentUser.getId() : null;
        UUID targetUserId = userService.getUser(username).getId();
        return subscriptionService.getFollowers(targetUserId, currentUserId, query, pageable);
    }

    // @GetMapping("/me/following")
    // public Page<UserFollowDto> getMyFollowing(
    //         @org.springframework.web.bind.annotation.RequestParam(required = false) String query,
    //         @AuthenticationPrincipal CustomUserDetails currentUser,
    //         Pageable pageable) {
    //     if (currentUser == null)
    //         throw new RuntimeException("Unauthorized");
    //     return subscriptionService.getFollowing(currentUser.getId(), currentUser.getId(), query, pageable);
    // }

    // @GetMapping("/me/followers")
    // public Page<UserFollowDto> getMyFollowers(
    //         @org.springframework.web.bind.annotation.RequestParam(required = false) String query,
    //         @AuthenticationPrincipal CustomUserDetails currentUser,
    //         Pageable pageable) {
    //     if (currentUser == null)
    //         throw new RuntimeException("Unauthorized");
    //     return subscriptionService.getFollowers(currentUser.getId(), currentUser.getId(), query, pageable);
    // }
}
