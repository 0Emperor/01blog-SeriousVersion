package com.example.__Blog.controller;

import com.example.__Blog.dto.ProfileDto;
import com.example.__Blog.dto.Userdto;
import com.example.__Blog.helper.CustomUserDetails;
import com.example.__Blog.helper.JwtUtil;
import com.example.__Blog.model.User;
import com.example.__Blog.service.CustomUserDetailsService;
import com.example.__Blog.service.ProfileService;
import com.example.__Blog.service.UserService;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;
    private final UserService userService;
    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    public ProfileController(ProfileService profileService, UserService us) {
        this.profileService = profileService;
        userService = us;
    }

    @GetMapping("/{username}")
    public ResponseEntity<ProfileDto> getProfile(
            @PathVariable String username,
            @AuthenticationPrincipal(expression = "id") UUID currentUserId) {
        System.out.println("helelm");
        ProfileDto profile = profileService.getProfile(username, currentUserId);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/curent")
    public ResponseEntity<Userdto> getCurrentUser(@AuthenticationPrincipal CustomUserDetails cu) {
        User user = userService.getUser(cu.getUsername());
        return ResponseEntity.ok().body(Userdto.from(user));
    }

    @PutMapping("/me")
    public ResponseEntity<Object> updateProfile(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) MultipartFile profile,
            @AuthenticationPrincipal(expression = "id") UUID currentUserId) throws IOException {

        Userdto updated = userService.updateProfile(currentUserId, username, bio, profile);
        CustomUserDetails userDetails = userDetailsService.loadUserByUsername(updated.username());
        String jwt = jwtUtil.generateToken(userDetails);

        Map<String, Object> res = new HashMap<>();
        res.put("jwt", jwt);
        res.put("user", updated);
        return ResponseEntity.ok(res);
    }
}
