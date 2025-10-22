package com.example.__Blog.service;

import com.example.__Blog.dto.Notificationdto;
import com.example.__Blog.model.Notification;
import com.example.__Blog.model.NotificationType;
import com.example.__Blog.model.User;
import com.example.__Blog.repository.NotificationRepository;
import com.example.__Blog.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

        private final NotificationRepository notificationRepository;
        private final UserRepository userRepository;

        public Notification createNotification(User sender, User toNotify, String link, NotificationType type) {
                Notification notification = new Notification();
                notification.setSender(sender);
                notification.setToNotify(toNotify);
                notification.setLink(link);
                notification.setType(type);
                notification.setSeen(false);
                notification.setCreatedAt(Instant.now());
                return notificationRepository.save(notification);
        }

        @Transactional
        public void deleteNotification(UUID uid, Integer nId) {
                Notification notification = notificationRepository.findById(nId)
                                .orElseThrow(() -> new RuntimeException("Notification not found"));
                if (!notification.getToNotify().getId().equals(uid)) {
                        throw new AccessDeniedException("U can't delete other s notifications");
                }
                notificationRepository.delete(notification);
        }

        public void deleteAllNotificationsFor(UUID uid) {
                notificationRepository.deleteByToNotifyId(uid);
        }

        public List<Notificationdto> getNotifications(UUID userId, int page, int size) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Page<Notification> notificationsPage = notificationRepository.findByToNotifyOrderByCreatedAtDesc(user,
                                PageRequest.of(page, size));

                return notificationsPage.stream()
                                .map(Notificationdto::from)
                                .collect(Collectors.toList());
        }

        public long countUnread(UUID userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                return notificationRepository.countByToNotifyAndSeenFalse(user);
        }

        @Transactional
        public void markAsSeen(Integer notificationId, UUID userId) {
                Notification notification = notificationRepository.findById(notificationId)
                                .orElseThrow(() -> new RuntimeException("Notification not found"));

                if (!notification.getToNotify().getId().equals(userId)) {
                        throw new RuntimeException("Cannot mark another user's notification as seen");
                }

                notification.setSeen(true);
                notificationRepository.save(notification);
        }

        @Transactional
        public void markAllAsSeen(UUID userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<Notification> notifications = notificationRepository
                                .findByToNotifyOrderByCreatedAtDesc(user, PageRequest.of(0, Integer.MAX_VALUE))
                                .getContent();

                notifications.forEach(n -> n.setSeen(true));
                notificationRepository.saveAll(notifications);
        }
}
