package com.example.__Blog.controller;

import com.example.__Blog.dto.ProfileDto;
import com.example.__Blog.dto.UserUpdateDto;
import com.example.__Blog.dto.Userdto;
import com.example.__Blog.helper.CustomUserDetails;
import com.example.__Blog.helper.JwtUtil;
import com.example.__Blog.model.User;
import com.example.__Blog.service.CustomUserDetailsService;
import com.example.__Blog.service.ProfileService;
import com.example.__Blog.service.UserService;

import jakarta.validation.Valid;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
        ProfileDto profile = profileService.getProfile(username, currentUserId);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/curent")
    public ResponseEntity<Userdto> getCurrentUser(@AuthenticationPrincipal CustomUserDetails cu) {
        User user = userService.getUser(cu.getUsername());
        return ResponseEntity.ok().body(Userdto.from(user));
    }

    @PutMapping("/me")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @Valid @ModelAttribute UserUpdateDto userUpdateDto,
            @AuthenticationPrincipal(expression = "id") UUID currentUserId) {

        // Update user via service
        Userdto updated;
        try {
            updated = userService.updateProfile(currentUserId,
                    userUpdateDto.username(),
                    userUpdateDto.name(),
                    userUpdateDto.bio(),
                    userUpdateDto.profile());

        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Username is already taken"));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Something went wrong"));
        }
        // Build response
        Map<String, Object> res = new HashMap<>();
        res.put("user", updated);
        if (userUpdateDto.username()!=null&&!userUpdateDto.username().isEmpty()) {
            // Reload user details and generate new JWT
            CustomUserDetails userDetails = userDetailsService.loadUserByUsername(updated.username());
            String jwt = jwtUtil.generateToken(userDetails);
            res.put("jwt", jwt);
        }
        return ResponseEntity.ok(res);
    }

}
