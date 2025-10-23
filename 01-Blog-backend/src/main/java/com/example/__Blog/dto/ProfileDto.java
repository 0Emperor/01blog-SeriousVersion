package com.example.__Blog.dto;

import java.util.List;

import com.example.__Blog.model.User;

public record ProfileDto(
        Userdto user,
        List<Userdto> people,
        Long followersCount,
        Long followingCount,
        boolean isFollowing,
        boolean isMe) {
    /**
     * Factory method to create a ProfileDto.
     *
     * @param user           The main user of the profile
     * @param mutuals        List of up to 3 mutual followers
     * @param followersCount Total number of followers
     * @param followingCount Total number of people the user is following
     * @param isFollowing    True if current logged-in user follows this profile
     * @param isMe           True if viewing own profile
     * @return ProfileDto instance
     */
    public static ProfileDto from(
            User user,
            List<User> mutuals,
            Long followersCount,
            Long followingCount,
            boolean isFollowing,
            boolean isMe) {
        List<Userdto> people = mutuals != null ? mutuals.stream().map(Userdto::from).toList() : List.of();
        return new ProfileDto(Userdto.from(user), people, followersCount, followingCount, isFollowing, isMe);
    }
}
