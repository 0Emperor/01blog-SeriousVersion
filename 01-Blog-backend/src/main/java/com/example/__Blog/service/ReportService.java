package com.example.__Blog.service;

import java.util.UUID;

import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.example.__Blog.dto.ReportDto;
import com.example.__Blog.model.Post;
import com.example.__Blog.model.Report;
import com.example.__Blog.model.User;
import com.example.__Blog.model.Report.reason;
import com.example.__Blog.model.Report.state;
import com.example.__Blog.repository.PostRepository;
import com.example.__Blog.repository.ReportRepository;
import com.example.__Blog.repository.UserRepository;

@Service
public class ReportService {
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    ReportService(ReportRepository r, UserRepository u, PostRepository p) {
        reportRepository = r;
        userRepository = u;
        postRepository = p;
    }

    public void createReport(reason reason, Integer pid, UUID uid) {
        User user = userRepository.findById(uid).orElseThrow(() -> {
            throw new ResourceNotFoundException("User not found (somehow)");
        });
        Post post = postRepository.findById(pid).orElseThrow(() -> {
            throw new ResourceNotFoundException("Post not found (somehow)");
        });
        if (post.getUser().getRole().equals("ADMIN")) {
            throw new AccessDeniedException("u cannot report a post by an admin");
        }
        if (post.getUser().getId().equals(uid)) {
            throw new AccessDeniedException("u can't report your own posts");
        }
        Report report = new Report();
        report.setState(state.PENDING);
        report.setReason(reason);
        report.setReportedBy(user);
        report.setReportedPost(post);
        reportRepository.save(report);
    }
}
