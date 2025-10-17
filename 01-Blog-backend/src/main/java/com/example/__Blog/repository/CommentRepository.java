package com.example.__Blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.__Blog.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    Integer countByPostId(Integer pId);
}
