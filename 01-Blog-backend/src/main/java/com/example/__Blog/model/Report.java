package com.example.__Blog.model;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "reports")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "reported_id")
    private Post reportedPost;

    @ManyToOne
    @JoinColumn(name = "reported_by_id")
    private User reportedBy;

    private String reason;
    private Date createdAt;

    private boolean resolved; // handled by admin

    public Date getCreatedAt() {
        return createdAt;
    }

    public String getReason() {
        return reason;
    }

    public User getReportedBy() {
        return reportedBy;
    }

    public Post getReportedPostreportedPost() {
        return reportedPost;
    }

    public void setResolved(boolean resolved) {
        this.resolved = resolved;
    }

    public boolean getResolved() {
        return resolved;
    }
}
