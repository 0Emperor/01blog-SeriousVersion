package com.example.__Blog.repository;

import com.example.__Blog.model.Notification;
import com.example.__Blog.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    // Fetch all notifications for a user, paginated, latest first
    Page<Notification> findByToNotifyOrderByCreatedAtDesc(User toNotify, Pageable pageable);

    // Fetch unread notifications only
    Page<Notification> findByToNotifyAndSeenFalseOrderByCreatedAtDesc(User toNotify, Pageable pageable);

    // Optional: count unread notifications
    long countByToNotifyAndSeenFalse(User toNotify);
}
