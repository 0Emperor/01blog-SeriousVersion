package com.example.__Blog.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.__Blog.model.Subscription;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Integer> {
    Page<Subscription> findBySubscriberId(UUID subscriberId, Pageable pageable);

    Page<Subscription> findBySubscribedToId(UUID subscribedToId, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT s FROM Subscription s WHERE s.subscriber.id = :subscriberId AND (:query IS NULL OR LOWER(s.subscribedTo.username) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.subscribedTo.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Subscription> findBySubscriberIdAndQuery(
            @org.springframework.data.repository.query.Param("subscriberId") UUID subscriberId,
            @org.springframework.data.repository.query.Param("query") String query, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT s FROM Subscription s WHERE s.subscribedTo.id = :subscribedToId AND (:query IS NULL OR LOWER(s.subscriber.username) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.subscriber.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Subscription> findBySubscribedToIdAndQuery(
            @org.springframework.data.repository.query.Param("subscribedToId") UUID subscribedToId,
            @org.springframework.data.repository.query.Param("query") String query, Pageable pageable);

    boolean existsBySubscriberIdAndSubscribedToId(UUID subscriberId, UUID subscribedToId);

    @org.springframework.data.jpa.repository.Query("SELECT s.subscribedTo.id FROM Subscription s WHERE s.subscriber.id = :subscriberId AND s.subscribedTo.id IN :ids")
    java.util.List<UUID> findSubscribedUserIds(
            @org.springframework.data.repository.query.Param("subscriberId") UUID subscriberId,
            @org.springframework.data.repository.query.Param("ids") java.util.List<UUID> ids);
}
