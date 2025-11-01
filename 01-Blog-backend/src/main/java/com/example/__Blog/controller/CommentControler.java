package com.example.__Blog.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.__Blog.dto.Commentdto;
import com.example.__Blog.helper.CustomUserDetails;
import com.example.__Blog.model.Comment;
import com.example.__Blog.service.CommentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/comment")
public class CommentControler {

    private final CommentService commentService;

    CommentControler(CommentService cmt) {
        commentService = cmt;
    }

    @PostMapping
    public ResponseEntity<Object> AddComment(@AuthenticationPrincipal CustomUserDetails cUserDetails,
           @Valid @RequestBody Commentdto cmt) {
        return ResponseEntity.ok().body(
                Commentdto.from(
                        commentService.AddComment(cmt.content(), cmt.pid(), cUserDetails.getId()),
                        cUserDetails.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteComment(@AuthenticationPrincipal CustomUserDetails cUserDetails,
            @PathVariable Integer id) {
        commentService.deleteComment(id, cUserDetails.getId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateComment(@AuthenticationPrincipal CustomUserDetails cUserDetails,
            @PathVariable Integer id,
           @Valid @RequestBody Commentdto nComment) {
        return ResponseEntity.ok().body(Commentdto.from(commentService.updaComment(nComment.content(), id, cUserDetails.getId()),cUserDetails.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getComments(
            @AuthenticationPrincipal CustomUserDetails jwt,
            @PathVariable Integer id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Comment> comments = commentService.getCommentsPerPost(id, pageable);
        List<Commentdto> dtos = comments.stream()
                .map(i -> Commentdto.from(i, jwt.getId()))
                .collect(Collectors.toList());
        Map<String, Object> r = new HashMap<>();
        r.put("comment", dtos);
        r.put("hasNext", comments.hasNext());
        return ResponseEntity.ok().body(r);
    }
}
