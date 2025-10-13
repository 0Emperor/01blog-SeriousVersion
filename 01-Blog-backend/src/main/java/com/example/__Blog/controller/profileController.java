package com.example.__Blog.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.__Blog.dto.PostResponse;
import com.example.__Blog.helper.CustomUserDetails;
import com.example.__Blog.model.Post;
import com.example.__Blog.model.User;
import com.example.__Blog.service.PostService;
import com.example.__Blog.service.UserService;

@RestController
@RequestMapping("/api/profile")
public class profileController {
    private final PostService postService;
    private final UserService userService;

    profileController(PostService postService, UserService userService) {
        this.postService = postService;
        this.userService = userService;
    }

    @GetMapping("/{name}")
    public String getOthersProfiles(@PathVariable String name) {
        return name;
    }

    @GetMapping("")
    public Map<String, String> getProfile(@AuthenticationPrincipal CustomUserDetails jwt) {
        Map<String, String> m = new HashMap<>();
        m.put("name", jwt.getId().toString());
        return m;
    }

    @GetMapping("/curent")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal CustomUserDetails cu) {
        Map<String, Object> res = new HashMap<>();
        User user = userService.getUser(cu.getUsername());
        res.put("username", user.getUsername());
        res.put("role", user.getRole());
        res.put("avatarUrl", user.getProfile());
        res.put("bio", user.getBio());
        res.put("created_at", user.getCreated_at());
        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/posts")
    public ResponseEntity<List<PostResponse>> GetOwnPosts(
            @AuthenticationPrincipal CustomUserDetails jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Post> postsPage = postService.getByUser(pageable, jwt.getId());

        List<PostResponse> dtos = postsPage.stream()
                .map(i -> PostResponse.mapToDto(i, jwt.getId()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/posts/{name}")
    public ResponseEntity<List<PostResponse>> GetOthersPosts(
            @AuthenticationPrincipal CustomUserDetails jwt,
            @PathVariable String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Post> postsPage = postService.getByUser(pageable, name);

        List<PostResponse> dtos = postsPage.stream()
                .map(i -> PostResponse.mapToDto(i, jwt.getId()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    // @GetMapping("/discover")
    // public List<userResponse> getAllPeople() {
    // List l = new ArrayList<>();
    // l.add(new userResponse());
    // return l;
    // }
}
