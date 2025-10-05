package com.example.__Blog.controller;

import com.example.__Blog.dto.PostResponse;
import com.example.__Blog.helper.CustomUserDetails;
import com.example.__Blog.model.Post;
import com.example.__Blog.model.User;
import com.example.__Blog.service.PostService;
import com.example.__Blog.service.UserService;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final UserService userService;
    private final String staticDir = "src/static/posts/";

    public PostController(PostService postService, UserService userService) {
        this.postService = postService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @AuthenticationPrincipal CustomUserDetails jwt,
            @RequestParam("description") String description,
            @RequestParam(value = "media", required = false) MultipartFile mediaFile) throws IOException {

        String mediaUrl = null;

        if (mediaFile != null && !mediaFile.isEmpty()) {
            Files.createDirectories(Paths.get(staticDir));
            String fileName = UUID.randomUUID() + "_" + mediaFile.getOriginalFilename();
            Path filePath = Paths.get(staticDir).resolve(fileName);
            Files.copy(mediaFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            mediaUrl = staticDir + fileName;
        }

        Post post = new Post();
        post.setDescription(description);
        post.setMediaUrl(mediaUrl);
        post.setCreatedAt(Date.valueOf(LocalDate.now()));

        User user = userService.getUser(jwt.getUsername());
        post.setUser(user);
        Post savedPost = postService.save(post);

        return ResponseEntity.ok(PostResponse.mapToDto(savedPost));
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Post> postsPage = postService.getAll(pageable);

        List<PostResponse> dtos = postsPage.stream()
                .map(PostResponse::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Integer id) {
        Post post = postService.getById(id);
        return (post != null) ? ResponseEntity.ok(PostResponse.mapToDto(post)) : ResponseEntity.notFound().build();
    }

}
