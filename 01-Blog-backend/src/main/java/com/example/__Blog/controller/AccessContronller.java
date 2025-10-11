package com.example.__Blog.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.__Blog.helper.CustomUserDetails;
@RestController
@RequestMapping("/access")
public class AccessContronller {
    // @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("")
    public boolean isLogged() {
        return true;
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public boolean isAdmin(@AuthenticationPrincipal CustomUserDetails cu) {
        System.out.println("ohhh");
        System.out.println(cu.getAuthorities().toString());
        return true;
    }
}