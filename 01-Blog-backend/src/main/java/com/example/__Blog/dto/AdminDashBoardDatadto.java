package com.example.__Blog.dto;

import java.util.List;

public record AdminDashBoardDatadto(
                List<ReportDto> recentReports,
                List<Userdto> recentUsers,
                Stat ReportsStats,
                Stat PostsStats,
                Stat UsersStats) {
}
