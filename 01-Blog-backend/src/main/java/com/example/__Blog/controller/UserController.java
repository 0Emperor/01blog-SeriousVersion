package com.example.__Blog.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.__Blog.dto.Userdto;
import com.example.__Blog.helper.CustomUserDetails;
import com.example.__Blog.model.User;
import com.example.__Blog.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/all")
    public List<Userdto> getall(@AuthenticationPrincipal CustomUserDetails cu) {
        return userService.getAllUsersNotFollowed(cu.getId()).stream().map(Userdto::from).toList();
    }
}
