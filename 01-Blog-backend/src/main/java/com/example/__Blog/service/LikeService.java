package com.example.__Blog.service;

import java.util.UUID;

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

    @Transactional
    public void likePost(UUID userId, Integer postId) {
        User user = userRepository.findById(userId).orElse(null);
        Post post = postRepository.findById(postId).orElse(null);
        if (!likeRepository.existsByUserIdAndPostId(userId, postId) && user != null && post != null) {
            Like like = new Like();
            like.setUser(user);
            like.setPost(post);
            likeRepository.save(like);
        }
    }

    @Transactional
    public void unlikePost(UUID userId, Integer postId) {
        likeRepository.deleteByUserIdAndPostId(userId, postId);
    }

}
