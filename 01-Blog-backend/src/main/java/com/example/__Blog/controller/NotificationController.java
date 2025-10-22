package com.example.__Blog.controller;

import com.example.__Blog.dto.Notificationdto;
import com.example.__Blog.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<Notificationdto>> getNotifications(
            @AuthenticationPrincipal(expression = "id") UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<Notificationdto> notifications = notificationService.getNotifications(userId, page, size);
        return ResponseEntity.ok(notifications);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAll(
            @AuthenticationPrincipal(expression = "id") UUID userId) {
        notificationService.deleteAllNotificationsFor(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(@AuthenticationPrincipal(expression = "id") UUID userId) {
        long count = notificationService.countUnread(userId);
        return ResponseEntity.ok(count);
    }

    @PostMapping("/{id}/seen")
    public ResponseEntity<Void> markAsSeen(
            @PathVariable("id") Integer notificationId,
            @AuthenticationPrincipal(expression = "id") UUID userId) {
        notificationService.markAsSeen(notificationId, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable("id") Integer notificationId,
            @AuthenticationPrincipal(expression = "id") UUID userId) {
        notificationService.deleteNotification(userId, notificationId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/seen-all")
    public ResponseEntity<Void> markAllAsSeen(
            @AuthenticationPrincipal(expression = "id") UUID userId) {
        notificationService.markAllAsSeen(userId);
        return ResponseEntity.ok().build();
    }
}
