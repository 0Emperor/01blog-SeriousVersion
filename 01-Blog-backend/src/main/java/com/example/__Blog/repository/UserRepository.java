package com.example.__Blog.repository;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.__Blog.model.User;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);

    @Query("""
                SELECT u FROM User u
                WHERE u.id <> :userId
                  AND u.id NOT IN (
                      SELECT s.subscribedTo.id FROM Subscription s WHERE s.subscriber.id = :userId
                  )
            """)
    List<User> findUsersNotFollowedBy(@Param("userId") UUID userId);

    @Query("SELECT u FROM User u ORDER BY u.created_at DESC")
    List<User> findLast3Users(PageRequest pageable);

    @Query("SELECT COUNT(u) FROM User u WHERE u.created_at > :time")
    long countByCreatedAtAfter(@Param("time") LocalDateTime date);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET isBaned = true WHERE u.id = :id")
    void banUser(@Param("id") UUID uid);
    @Modifying
    @Transactional
    @Query("UPDATE User u SET isBaned = false WHERE u.id = :id")
    void unbanUser(@Param("id") UUID uid);
}
