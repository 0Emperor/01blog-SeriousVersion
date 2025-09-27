package com.example.__Blog.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/access")
public class AccessContronller {
    @GetMapping("")
    public boolean isLogged() {
        return true;
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public boolean isAdmin() {
        return true;
    }
}