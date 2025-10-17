package com.example.__Blog.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

import com.example.__Blog.dto.Postdto;
import com.example.__Blog.dto.Userdto;
import com.example.__Blog.helper.CustomUserDetails;
import com.example.__Blog.model.Post;
import com.example.__Blog.model.User;
import com.example.__Blog.service.CommentService;
import com.example.__Blog.service.LikeService;
import com.example.__Blog.service.PostService;
import com.example.__Blog.service.UserService;

@RestController
@RequestMapping("/api/profile")
public class profileController {
    private final PostService postService;
    private final CommentService commentService;
    private final UserService userService;
    private final LikeService likeService;

    profileController(PostService postService, CommentService commentService, UserService userService,
            LikeService likeService) {
        this.postService = postService;
        this.userService = userService;
        this.likeService = likeService;
        this.commentService = commentService;
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
    public ResponseEntity<Userdto> getCurrentUser(@AuthenticationPrincipal CustomUserDetails cu) {
        User user = userService.getUser(cu.getUsername());
        return ResponseEntity.ok().body(Userdto.from(user));
    }

    @GetMapping("/posts")
    public ResponseEntity<List<Postdto>> GetOwnPosts(
            @AuthenticationPrincipal CustomUserDetails jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Post> postsPage = postService.getByUser(pageable, jwt.getId());

        List<Postdto> dtos = postsPage.stream()
                .map(i -> Postdto.from(i, jwt.getId(), likeService.getLikeCount(i.getId()), commentService.CountComment(i.getId()),
                        likeService.didUserLikePost(jwt.getId(), i.getId())))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/posts/{name}")
    public ResponseEntity<List<Postdto>> GetOthersPosts(
            @AuthenticationPrincipal CustomUserDetails jwt,
            @PathVariable String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Post> postsPage = postService.getByUser(pageable, name);

        List<Postdto> dtos = postsPage.stream()
                .map(i -> Postdto.from(i, jwt.getId(), likeService.getLikeCount(i.getId()), commentService.CountComment(i.getId()),
                        likeService.didUserLikePost(jwt.getId(), i.getId())))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

}
