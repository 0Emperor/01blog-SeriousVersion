package com.example.__Blog.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.__Blog.dto.ReportDto;
import com.example.__Blog.dto.Stat;
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

    @Transactional
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

    @Transactional
    public void createReport(reason reason, String description, UUID reportedUserId, UUID reporterId) {
        User reportedUser = userRepository.findById(reportedUserId).orElseThrow(() -> {
            throw new ResourceNotFoundException("User not found");
        });
        User reporter = userRepository.findById(reporterId).orElseThrow(() -> {
            throw new ResourceNotFoundException("Reporter not found");
        });

        if (reportedUser.getId().equals(reporterId)) {
            throw new AccessDeniedException("You can't report yourself");
        }

        if (reportedUser.getRole().equals("ADMIN")) {
            throw new AccessDeniedException("You cannot report an admin");
        }

        Report report = new Report();
        report.setState(state.PENDING);
        report.setReason(reason);
        if (description != null && description.length() <= 33) {
            report.setDescription(description);
        }
        report.setReportedBy(reporter);
        report.setReportedUser(reportedUser);
        reportRepository.save(report);
    }

    @Transactional
    public void dismissReport(Integer rId) {
        Report report = reportRepository.findById(rId).orElseThrow(() -> {
            throw new ResourceNotFoundException("Report not found (somehow)");
        });
        report.setState(state.DISMISSED);
        reportRepository.save(report);
    }

    @Transactional
    public void takeAction(Integer rId) {
        Report report = reportRepository.findById(rId).orElseThrow(() -> {
            throw new ResourceNotFoundException("Report not found (somehow)");
        });
        if (!report.getState().equals(state.PENDING)) {
            throw new AccessDeniedException("Report already resolved");
        }
        Post post = report.getReportedPost();
        post.setHidden(true);
        report.setState(state.ACTION_TAKEN);
        postRepository.save(post);
        reportRepository.save(report);
    }

    public List<ReportDto> getAllReport() {
        return reportRepository.findAll().stream().map(ReportDto::from).toList();
    }

    public List<ReportDto> getLast3Reports() {
        return reportRepository.findTop3ByStateOrderByCreatedAtDesc(state.PENDING).stream()
                .map(ReportDto::from)
                .toList();
    }

    public Stat countUnhandeledReports() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        Long all = reportRepository.countByState(state.PENDING);
        long lastWeek = reportRepository.countByStateAndCreatedAtAfter(state.PENDING, oneWeekAgo);
        long prec = 0;
        if (all != 0) {
            prec = lastWeek / all * 100;
        }

        return new Stat(all, prec);
    }
}
