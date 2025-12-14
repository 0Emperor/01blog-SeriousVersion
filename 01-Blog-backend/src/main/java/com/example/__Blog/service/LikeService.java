package com.example.__Blog.service;

import java.util.UUID;

import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.example.__Blog.model.Like;
import com.example.__Blog.model.Post;
import com.example.__Blog.model.User;
import com.example.__Blog.repository.LikeRepository;
import com.example.__Blog.repository.PostRepository;
import com.example.__Blog.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class LikeService {
    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    LikeService(LikeRepository likeRepository, PostRepository postRepository, UserRepository userRepository) {
        this.likeRepository = likeRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public Integer getLikeCount(Integer pId) {
        return likeRepository.countByPostId(pId);
    }

    @Transactional
    public void likePost(UUID userId, Integer postId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("no such user"));
        Post post = postRepository.findById(postId).orElseThrow(
                () -> new ResourceNotFoundException("post not found"));
        if (post.getHidden() && !post.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Cannot like a hidden post");
        }
        if (!likeRepository.existsByUserIdAndPostId(userId, postId)) {
            Like like = new Like();
            like.setUser(user);
            like.setPost(post);
            likeRepository.save(like);
        }
    }

    public boolean didUserLikePost(UUID userId, Integer postId) {
        return likeRepository.existsByUserIdAndPostId(userId, postId);
    }

    @Transactional
    public void unlikePost(UUID userId, Integer postId) {
        likeRepository.deleteByUserIdAndPostId(userId, postId);
    }

}
