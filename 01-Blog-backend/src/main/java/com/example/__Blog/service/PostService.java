package com.example.__Blog.service;

import com.example.__Blog.model.NotificationType;
import com.example.__Blog.model.Post;
import com.example.__Blog.model.User;
import com.example.__Blog.repository.FollowRepository;
import com.example.__Blog.repository.PostRepository;
import com.example.__Blog.specification.PostSpecifications;

import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final NotificationService notificationService;
    private final FollowRepository followRepository;

    public PostService(PostRepository postRepository, FollowRepository fr, NotificationService ns) {
        this.postRepository = postRepository;
        notificationService = ns;
        followRepository = fr;
    }

    public Post save(Post post) {
        post.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        postRepository.save(post);
        List<User> followers = followRepository.findSubscribersByUserId(post.getUser().getId());
        for (User follower : followers) {
            notificationService.createNotification(
                    post.getUser(),
                    follower,
                    "/" + post.getId(),
                    NotificationType.POST);
        }
        return post;
    }

    public Post createPost(String description, String title, User user, String[] media) {
        Post post = new Post();
        post.setTitle(title);
        post.setDescription(description);
        post.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        post.setUser(user);
        return post;
    }

    public Post ediPost(UUID uId, Integer pID, String description, String title, String[] media) {
        Post toEdit = postRepository.findById(pID).orElseThrow(
                () -> new ResourceNotFoundException("Post not found"));
        if (!toEdit.getUser().getId().equals(uId)) {
            throw new AccessDeniedException("U can only edit your own posts");
        }
        toEdit.setDescription(description);
        toEdit.setMedia(media);
        toEdit.setTitle(title);
        return postRepository.save(toEdit);
    }

    public void deletePost(UUID uId, Integer pID, String role) {
        Post toDelete = postRepository.findById(pID).orElseThrow(
                () -> new ResourceNotFoundException("Post not found"));
        System.out.println(role);
        if (role != "Admin" && !toDelete.getUser().getId().equals(uId)) {
            throw new AccessDeniedException("U can only edit your own posts");
        }
        postRepository.delete(toDelete);
        if (role == "Admin" && !toDelete.getUser().getId().equals(uId)) {
            notificationService.createNotification(
                    null,
                    toDelete.getUser(),
                    "/" + toDelete.getId(),
                    NotificationType.HIDDEN);
        }
    }

    public void hidePost(Integer pID) {
        Post toHide = postRepository.findById(pID).orElseThrow(
                () -> new ResourceNotFoundException("Post not found"));
        toHide.setHidden(true);
        postRepository.save(toHide);
        notificationService.createNotification(
                null,
                toHide.getUser(),
                null,
                NotificationType.REMOVED);
    }

    public void unHidePost(Integer pID) {
        Post toHide = postRepository.findById(pID).orElseThrow(
                () -> new ResourceNotFoundException("Post not found"));
        toHide.setHidden(false);
        postRepository.save(toHide);
    }

    
    public List<Post> getAll() {
        return postRepository.findAll();
    }

    public Page<Post> getAll(PageRequest pageable) {
        return postRepository.findAll(pageable);
    }

    public Page<Post> getAllFromFollowed(UUID id, PageRequest pageable) {
        return postRepository.findPostsFromSubscribedUsersAndNotHidden(id, pageable);
    }

    public Page<Post> getByUser(PageRequest pageable, UUID id) {
        return postRepository.findAll(PostSpecifications.byUserId(id), pageable);
    }

    public Page<Post> getByUser(PageRequest pageable, String name) {
        return postRepository.findAll(PostSpecifications.byUserName(name), pageable);
    }

    public Post getById(Integer id) {
        return postRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("post not found"));
    }
}
