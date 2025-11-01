package com.example.__Blog.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.__Blog.dto.Toastdto;
import com.example.__Blog.dto.Toastdto.type;
import com.example.__Blog.helper.CustomUserDetails;

@RestController
@RequestMapping("/access")
public class AccessContronller {
    @GetMapping("")
    public ResponseEntity<Map<String, Object>> isLogged(@AuthenticationPrincipal CustomUserDetails cu) {
        Map<String, Object> result = new HashMap<>();
        result.put("toast", new Toastdto("Hello there!", "welcome back " + cu.getUsername(), type.info));
        result.put("body", true);
        return ResponseEntity.ok().body(result);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public boolean isAdmin() {
        return true;
    }
}