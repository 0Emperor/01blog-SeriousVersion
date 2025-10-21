package com.example.__Blog.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.__Blog.model.Subscription;
import com.example.__Blog.model.User;

import jakarta.transaction.Transactional;

public interface FollowRepository extends JpaRepository<Subscription, Integer> {
    Optional<Subscription> findBySubscriberIdAndSubscribedToId(UUID subscriberId, UUID subscribedToId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Subscription s WHERE s.subscriber.id = :followerId AND s.subscribedTo.id = :followedId")
    int deleteBySubscriberIdAndSubscribedToId(@Param("followerId") UUID followerId,
            @Param("followedId") UUID followedId);

    @Query("SELECT s.subscriber FROM Subscription s WHERE s.subscribedTo.id = :userId")
    List<User> findSubscribersByUserId(@Param("userId") UUID userId);
}
