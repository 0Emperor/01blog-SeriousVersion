package com.example.__Blog.controller;

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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.__Blog.dto.AdminDashBoardDatadto;
import com.example.__Blog.dto.Postdto;
import com.example.__Blog.dto.ReportDto;
import com.example.__Blog.dto.Stat;
import com.example.__Blog.dto.Userdto;
import com.example.__Blog.helper.CustomUserDetails;
import com.example.__Blog.model.Post;
import com.example.__Blog.service.CommentService;
import com.example.__Blog.service.LikeService;
import com.example.__Blog.service.PostService;
import com.example.__Blog.service.ReportService;
import com.example.__Blog.service.UserService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final PostService postService;
    private final UserService userService;
    private final LikeService likeService;
    private final CommentService commentService;
    private final ReportService reportService;

    AdminController(PostService ps, UserService us, LikeService ls, CommentService cs, ReportService rs) {
        postService = ps;
        likeService = ls;
        userService = us;
        commentService = cs;
        reportService = rs;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashBoardDatadto> hidePost() {
        List<ReportDto> reports = reportService.getLast3Reports();
        List<Userdto> users = userService.get3RecentUsers().stream().map(Userdto::from).toList();
        Stat reportsCount = reportService.countUnhandeledReports();
        Stat usersCount = userService.counts();
        Stat postsCount = postService.count();
        return ResponseEntity.ok().body(new AdminDashBoardDatadto(
                reports,
                users,
                reportsCount,
                postsCount,
                usersCount));
    }

    @PatchMapping("/hide/{id}")
    public ResponseEntity<?> hidePost(@PathVariable Integer id) {
        postService.hidePost(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/unhide/{id}")
    public ResponseEntity<?> unHidePost(@PathVariable Integer id) {
        postService.unHidePost(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Integer id) {
        postService.deletePost(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/dismiss/{id}")
    public ResponseEntity<?> dismissReport(@PathVariable Integer id) {
        reportService.dismissReport(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/ban/{id}")
    public ResponseEntity<?> banUser(@PathVariable UUID id) {
        userService.ban(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/unban/{id}")
    public ResponseEntity<?> UnbanUser(@PathVariable UUID id) {
        userService.unban(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/posts")
    public ResponseEntity<Map<String, Object>> getPosts(
            @AuthenticationPrincipal CustomUserDetails jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> postsPage = postService.getAll(pageable);
        List<Postdto> dtos = postsPage.stream()
                .map(i -> Postdto.from(i, jwt.getId(), likeService.getLikeCount(i.getId()),
                        commentService.CountComment(i.getId()),
                        likeService.didUserLikePost(jwt.getId(), i.getId())))
                .collect(Collectors.toList());
        Map<String, Object> r = new HashMap<>();
        r.put("posts", dtos);
        r.put("hasNext", postsPage.hasNext());
        return ResponseEntity.ok(r);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Userdto>> getUsers() {
        return ResponseEntity.ok(userService.getAllUsers().stream().map(Userdto::from).toList());
    }

    @GetMapping("/reports")
    public ResponseEntity<List<ReportDto>> getreports() {
        return ResponseEntity.ok(reportService.getAllReport());
    }
}
