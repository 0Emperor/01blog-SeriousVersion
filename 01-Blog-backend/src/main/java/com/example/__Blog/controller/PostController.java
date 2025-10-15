package com.example.__Blog.controller;

import com.example.__Blog.dto.PostResponse;
import com.example.__Blog.helper.CustomUserDetails;
import com.example.__Blog.model.Post;
import com.example.__Blog.model.User;
import com.example.__Blog.service.LikeService;
import com.example.__Blog.service.PostService;
import com.example.__Blog.service.UserService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final UserService userService;
    private final LikeService likeService;

    // private final String staticDir = "src/main/resources/static/posts/";

    public PostController(PostService postService, UserService userService,LikeService likeService) {
        this.postService = postService;
        this.userService = userService;
        this.likeService=likeService;
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @AuthenticationPrincipal CustomUserDetails jwt,
            @RequestBody Post pos) {
        User user = userService.getUser(jwt.getUsername());
        Post post = postService.createPost(pos.getDescription(), pos.getTitle(), user, pos.getMedia());
        Post savedPost = postService.save(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(PostResponse.mapToDto(savedPost, jwt.getId(),likeService.getLikeCount(savedPost.getId()),100,likeService.didUserLikePost(jwt.getId(),savedPost.getId())));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getPosts(
            @AuthenticationPrincipal CustomUserDetails jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        System.out.println("hello");
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> postsPage = postService.getAllFromFollowed(jwt.getId(), pageable);
        List<PostResponse> dtos = postsPage.stream()
                .map(i -> PostResponse.mapToDto(i, jwt.getId(),likeService.getLikeCount(i.getId()),100,likeService.didUserLikePost(jwt.getId(), i.getId())))
                .collect(Collectors.toList());
        Map<String, Object> r = new HashMap<>();
        r.put("posts", dtos);
        r.put("hasNext", postsPage.hasNext());
        return ResponseEntity.ok(r);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@AuthenticationPrincipal CustomUserDetails jwt,
            @PathVariable Integer id) {
        Post post = postService.getById(id);
        return (post != null) ? ResponseEntity.ok(PostResponse.mapToDto(post, jwt.getId(),likeService.getLikeCount(id),100,likeService.didUserLikePost(jwt.getId(), id)))
                : ResponseEntity.notFound().build();
    }

}
