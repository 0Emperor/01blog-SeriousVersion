package com.example.__Blog.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.__Blog.dto.ProfileDto;
import com.example.__Blog.model.User;
import com.example.__Blog.repository.FollowRepository;
import com.example.__Blog.repository.UserRepository;

@Service
@Transactional
public class ProfileService {

    private final UserRepository userRepository;
    private final FollowRepository FollowRepository;

    public ProfileService(UserRepository userRepository, FollowRepository FollowRepository) {
        this.userRepository = userRepository;
        this.FollowRepository = FollowRepository;
    }

    /**
     * Build a profile DTO for the given username.
     *
     * @param username      The profile user's username
     * @param currentUserId The currently logged-in user's ID
     * @return ProfileDto
     */
    public ProfileDto getProfile(String username, UUID currentUserId) {
        User profileUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        Long followersCount = FollowRepository.countBySubscribedTo(profileUser);
        Long followingCount = FollowRepository.countBySubscriber(profileUser);

        boolean isFollowing = FollowRepository.existsBySubscriberAndSubscribedTo(currentUser, profileUser);

        List<User> mutuals = FollowRepository.findMutuals(
                currentUser,
                profileUser,
                PageRequest.of(0, 3));

        boolean isMe = currentUser.getId().equals(profileUser.getId());
        return ProfileDto.from(profileUser, mutuals, followersCount, followingCount, isFollowing, isMe);
    }
}
