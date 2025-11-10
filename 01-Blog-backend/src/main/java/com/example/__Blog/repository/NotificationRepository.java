package com.example.__Blog.repository;

import com.example.__Blog.model.Notification;
import com.example.__Blog.model.User;

import jakarta.transaction.Transactional;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    // Fetch all notifications for a user, paginated, latest first
    Page<Notification> findByToNotifyOrderByCreatedAtDesc(User toNotify, Pageable pageable);

    // Fetch unread notifications only
    Page<Notification> findByToNotifyAndSeenFalseOrderByCreatedAtDesc(User toNotify, Pageable pageable);

    // Optional: count unread notifications
    long countByToNotifyAndSeenFalse(User toNotify);

    @Modifying
    @Transactional
    @Query("DELETE FROM Notification n WHERE n.toNotify.id = :userId AND n.seen = true")
    Integer deleteByToNotifyId(@Param("userId") UUID userId);

}
