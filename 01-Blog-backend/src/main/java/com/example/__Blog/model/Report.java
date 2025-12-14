package com.example.__Blog.model;

import java.sql.Timestamp;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "reports")
public class Report {
    public Report() {
        createdAt = new Timestamp(System.currentTimeMillis());
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "reported_user_id")
    private User reportedUser;

    @ManyToOne(fetch = FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "reported_id")
    private Post reportedPost;

    @ManyToOne(fetch = FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "reported_by_id")
    private User reportedBy;

    private reason reason;
    private String description;
    private Timestamp createdAt;
    private state state;

    public state getState() {
        return state;
    }

    public void setReason(reason reason) {
        this.reason = reason;
    }

    public void setReportedUser(User reportedUser) {
        this.reportedUser = reportedUser;
    }

    public void setReportedBy(User reportedBy) {
        this.reportedBy = reportedBy;
    }

    public void setReportedPost(Post reportedPost) {
        this.reportedPost = reportedPost;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setState(state state) {
        this.state = state;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public reason getReason() {
        return reason;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getReportedBy() {
        return reportedBy;
    }

    public Post getReportedPostreportedPost() {
        return reportedPost;
    }

    public User getReportedUser() {
        return reportedUser;
    }

    public Integer getId() {
        return id;
    }

    public Post getReportedPost() {
        return reportedPost;
    }

    public enum state {
        PENDING,
        ACTION_TAKEN,
        DISMISSED,
    }

    public enum reason {
        SPAM,
        HATE_SPEECH,
        INAPPROPRIATE_CONTENT,
        BULLYING_HARASSMENT,
        INTELLECTUAL_PROPERTY
    }
}
