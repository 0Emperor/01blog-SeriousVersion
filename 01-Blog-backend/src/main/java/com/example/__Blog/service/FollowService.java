package com.example.__Blog.service;

import java.util.UUID;

import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.__Blog.model.NotificationType;
import com.example.__Blog.model.Subscription;
import com.example.__Blog.model.User;
import com.example.__Blog.repository.FollowRepository;
import com.example.__Blog.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class FollowService {
    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Autowired
    FollowService(FollowRepository fr, UserRepository ur, NotificationService ns) {
        followRepository = fr;
        userRepository = ur;
        notificationService = ns;
    }

    @Transactional
    public void sendLinkToFollower(UUID senderId, UUID recipientId, String link) {
        User sender = userRepository.findById(senderId).orElseThrow(
                () -> new ResourceNotFoundException("Sender not found"));
        User recipient = userRepository.findById(recipientId).orElseThrow(
                () -> new ResourceNotFoundException("Repipient not found"));

        notificationService.createNotification(
                sender,
                recipient,
                link,
                NotificationType.LINK);
    }

    @Transactional
    public void follow(UUID followerId, UUID followedID) {
        User followed = userRepository.findById(followedID).orElseThrow(
                () -> new ResourceNotFoundException("no such user"));
        User follower = userRepository.findById(followerId).orElseThrow(
                () -> new ResourceNotFoundException("no such user"));
        
        Subscription follow = new Subscription();
        follow.setSubscribedTo(followed);
        follow.setSubscriber(follower);
        followRepository.save(follow);
        notificationService.createNotification(
                follower,
                followed,
                null,
                NotificationType.FOLLOW);
    }

    @Transactional
    public void unfollow(UUID followerId, UUID followedID) {
        if (followRepository.deleteBySubscriberIdAndSubscribedToId(followerId, followedID) == 0) {
            throw new ResourceNotFoundException("u can't unfollow without following");
        }
    }
}
