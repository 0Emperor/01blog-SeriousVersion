package com.example.__Blog.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private boolean seen = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "to_notify_id", nullable = false)
    private User toNotify;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "sender_id")
    private User sender;

    private String link;

    @CreationTimestamp
    private Instant createdAt;
public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
}

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    // ===== Getters & Setters =====
    public Integer getId() {
        return id;
    }

    public boolean isSeen() {
        return seen;
    }

    public void setSeen(boolean seen) {
        this.seen = seen;
    }

    public User getToNotify() {
        return toNotify;
    }

    public void setToNotify(User toNotify) {
        this.toNotify = toNotify;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }
}
