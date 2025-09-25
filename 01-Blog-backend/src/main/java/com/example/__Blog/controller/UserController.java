package com.example.__Blog.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.__Blog.model.User;
import com.example.__Blog.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{name}")
    public String health(@PathVariable String name) {
        User u = new User();
        u.setUsername(name);
        userService.createUser(u);
        return "OK";
    }

    @GetMapping("/us")
    public List<User> getall() {
        return userService.getAllUsers();
    }
}
