package com.example.__Blog.service;

import com.example.__Blog.model.Post;
import com.example.__Blog.model.User;
import com.example.__Blog.repository.PostRepository;
import com.example.__Blog.specification.PostSpecifications;

import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;


import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Post save(Post post) {
        post.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        return postRepository.save(post);
    }

    public Post createPost(String description, String title, User user,String[] media) {
        Post post = new Post();
        post.setTitle(title);
        post.setDescription(description);
        post.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        post.setUser(user);
        return post;
    }

    public List<Post> getAll() {
        return postRepository.findAll();
    }

    public Page<Post> getAll(PageRequest pageable) {
        return postRepository.findAll(pageable);
    }

    public Page<Post> getAllFromFollowed(UUID id,PageRequest pageable) {
        return postRepository.findPostsFromSubscribedUsers(id,pageable);
    }
    public Page<Post> getByUser(PageRequest pageable, UUID id) {
        return postRepository.findAll(PostSpecifications.byUserId(id), pageable);
    }

    public Page<Post> getByUser(PageRequest pageable, String name) {
        return postRepository.findAll(PostSpecifications.byUserName(name), pageable);
    }

    public Post getById(Integer id) {
        return postRepository.findById(id).orElseThrow(
           ()->  new  ResourceNotFoundException("post not found")
        );
    }
}
