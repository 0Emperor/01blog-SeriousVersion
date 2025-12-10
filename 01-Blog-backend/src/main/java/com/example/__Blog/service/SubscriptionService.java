package com.example.__Blog.service;

import com.example.__Blog.dto.UserFollowDto;
import com.example.__Blog.model.Subscription;
import com.example.__Blog.model.User;
import com.example.__Blog.repository.SubscriptionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    public SubscriptionService(SubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    public Page<UserFollowDto> getFollowing(UUID targetUserId, UUID currentUserId, String query, Pageable pageable) {
        Page<Subscription> subscriptions;
        if (query != null && !query.isBlank()) {
            subscriptions = subscriptionRepository.findBySubscriberIdAndQuery(targetUserId, query, pageable);
        } else {
            subscriptions = subscriptionRepository.findBySubscriberId(targetUserId, pageable);
        }

        List<User> users = subscriptions.stream().map(Subscription::getSubscribedTo).toList();
        Set<UUID> followedUserIds;

        if (currentUserId != null) {
            if (currentUserId.equals(targetUserId)) {
                // If viewing my own following, I follow all of them.
                followedUserIds = users.stream().map(User::getId).collect(Collectors.toSet());
            } else {
                List<UUID> userIds = users.stream().map(User::getId).toList();
                if (userIds.isEmpty()) {
                    followedUserIds = Collections.emptySet();
                } else {
                    followedUserIds = new java.util.HashSet<>(
                            subscriptionRepository.findSubscribedUserIds(currentUserId, userIds));
                }
            }
        } else {
            followedUserIds = Collections.emptySet();
        }

        List<UserFollowDto> dtos = users.stream().map(user -> new UserFollowDto(
                user.getId(),
                user.getUsername(),
                user.getProfile(),
                followedUserIds.contains(user.getId()))).toList();

        return new PageImpl<>(dtos, pageable, subscriptions.getTotalElements());
    }

    public Page<UserFollowDto> getFollowers(UUID targetUserId, UUID currentUserId, String query, Pageable pageable) {
        Page<Subscription> subscriptions;
        if (query != null && !query.isBlank()) {
            subscriptions = subscriptionRepository.findBySubscribedToIdAndQuery(targetUserId, query, pageable);
        } else {
            subscriptions = subscriptionRepository.findBySubscribedToId(targetUserId, pageable);
        }

        List<User> users = subscriptions.stream().map(Subscription::getSubscriber).toList();
        Set<UUID> followedUserIds;

        if (currentUserId != null) {
            List<UUID> userIds = users.stream().map(User::getId).toList();
            if (userIds.isEmpty()) {
                followedUserIds = Collections.emptySet();
            } else {
                followedUserIds = new java.util.HashSet<>(
                        subscriptionRepository.findSubscribedUserIds(currentUserId, userIds));
            }
        } else {
            followedUserIds = Collections.emptySet();
        }

        List<UserFollowDto> dtos = users.stream().map(user -> new UserFollowDto(
                user.getId(),
                user.getUsername(),
                user.getProfile(),
                followedUserIds.contains(user.getId()))).toList();

        return new PageImpl<>(dtos, pageable, subscriptions.getTotalElements());
    }
}
