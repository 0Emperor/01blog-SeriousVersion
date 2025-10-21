package com.example.__Blog.dto;

import com.example.__Blog.model.Notification;

public record Notificationdto(
        Integer id,
        Userdto sender,
        String link,
        boolean seen,
        String type,
        String createdAt) {

    public static Notificationdto from(Notification notification) {
        return new Notificationdto(
                notification.getId(),
                notification.getSender() != null ? Userdto.from(notification.getSender()) : null,
                notification.getLink(),
                notification.isSeen(),
                notification.getType().name(),
                notification.getCreatedAt() != null ? notification.getCreatedAt().toString() : null);
    }
}
