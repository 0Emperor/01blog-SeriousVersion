package com.example.__Blog.dto;

import com.example.__Blog.model.Report;
import com.example.__Blog.model.Report.reason;
import com.example.__Blog.model.Report.state;

public record ReportDto(
        Integer id,
        Userdto user,
        Postdto post,
        state state,
        reason reason) {
    public ReportDto from(Report report, Userdto user, Postdto post) {
        return new ReportDto(report.getId(),
                user,
                post,
                report.getState(),
                report.getReason());
    }
}
