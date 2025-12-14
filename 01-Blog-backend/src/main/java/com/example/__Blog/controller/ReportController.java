package com.example.__Blog.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import com.example.__Blog.model.Report;

import com.example.__Blog.helper.CustomUserDetails;
import com.example.__Blog.service.ReportService;
import com.example.__Blog.model.Report.reason;

@RestController
@RequestMapping("/api/report")
public class ReportController {
    private final ReportService reportService;

    ReportController(ReportService rs) {
        reportService = rs;
    }

    @PostMapping("/{id}")
    public ResponseEntity<Object> report(
            @AuthenticationPrincipal CustomUserDetails cu,
            @PathVariable Integer id,
            @RequestBody String Reason) {
        reportService.createReport(reason.valueOf(Reason), id, cu.getId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/user/{id}")
    public void reportUser(@AuthenticationPrincipal CustomUserDetails cu, @PathVariable java.util.UUID id,
            @RequestBody Map<String, String> payload) {
        String reasonStr = payload.get("reason");
        String description = payload.get("description");
        Report.reason reason = Report.reason.valueOf(reasonStr);
        reportService.createReport(reason, description, id, cu.getId());
    }
}
