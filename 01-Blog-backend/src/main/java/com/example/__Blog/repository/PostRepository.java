package com.example.__Blog.repository;

import com.example.__Blog.model.Post;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
@Repository
public interface PostRepository extends JpaRepository<Post, Integer>, JpaSpecificationExecutor<Post>{
@Query("""
    SELECT p FROM Post p
    WHERE p.user.id IN (
        SELECT s.subscribedTo.id FROM Subscription s
        WHERE s.subscriber.id = :userId
    ) OR p.user.id = :userId 
    ORDER BY p.createdAt DESC
""")

Page<Post> findPostsFromSubscribedUsers(@Param("userId") UUID userId, PageRequest pageable);

}
