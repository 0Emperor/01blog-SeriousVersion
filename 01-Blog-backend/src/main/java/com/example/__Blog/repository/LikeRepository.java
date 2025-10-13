package com.example.__Blog.repository;

import java.util.Set;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.__Blog.model.Like;

@Repository
public interface LikeRepository extends JpaRepository<Like, Integer> {

    @Query("SELECT l.post.id FROM Like l WHERE l.user.id = :userId")
    Set<Integer> findLikedPostIdsByUserId(@Param("userId") UUID userId);

    void deleteByUserIdAndPostId(UUID userId, Integer postId);

    boolean existsByUserIdAndPostId(UUID userId, Integer postId);

    Integer countByPostId(Integer postId);
}
