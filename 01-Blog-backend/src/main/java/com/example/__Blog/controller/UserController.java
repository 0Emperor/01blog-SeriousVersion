package com.example.__Blog.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.__Blog.dto.Userdto;
import com.example.__Blog.helper.CustomUserDetails;
import com.example.__Blog.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/all")
    public org.springframework.data.domain.Page<Userdto> getall(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String query,
            org.springframework.data.domain.Pageable pageable) {
        UUID currentUserId = currentUser != null ? currentUser.getId() : null;
        return userService.getAllUsers(pageable, query, currentUserId).map(Userdto::from);
    }
}
