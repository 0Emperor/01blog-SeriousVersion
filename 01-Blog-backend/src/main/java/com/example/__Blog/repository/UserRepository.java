package com.example.__Blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.__Blog.model.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);

    Optional<User> findById(UUID id);

    @Query("""
                SELECT u FROM User u
                WHERE u.id <> :userId
                  AND u.id NOT IN (
                      SELECT s.subscribedTo.id FROM Subscription s WHERE s.subscriber.id = :userId
                  )
            """)
    List<User> findUsersNotFollowedBy(@Param("userId") UUID userId);

}
