package com.example.__Blog.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.__Blog.model.Report;
import com.example.__Blog.model.Report.state;

import jakarta.transaction.Transactional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {
    List<Report> findTop3ByStateOrderByCreatedAtDesc(state state);

    long countByState(state state);

    long countByStateAndCreatedAtAfter(state state, LocalDateTime date);

    @Modifying
    @Transactional
    @Query("UPDATE Report SET state = :state WHERE reportedPost.id = :pid")
    void updateReports(@Param("pid") Integer pid, @Param("state") state state);
}
