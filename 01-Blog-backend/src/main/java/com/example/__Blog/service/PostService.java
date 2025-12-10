package com.example.__Blog.service;

import com.example.__Blog.dto.Stat;
import com.example.__Blog.model.NotificationType;
import com.example.__Blog.model.Post;
import com.example.__Blog.model.User;
import com.example.__Blog.model.Report.state;
import com.example.__Blog.repository.FollowRepository;
import com.example.__Blog.repository.PostRepository;
import com.example.__Blog.repository.ReportRepository;
import com.example.__Blog.specification.PostSpecifications;

import jakarta.transaction.Transactional;

import com.example.__Blog.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final NotificationService notificationService;
    private final FollowRepository followRepository;
    private final ReportRepository reportRepository;

    public PostService(PostRepository postRepository, FollowRepository fr, NotificationService ns,
            ReportRepository rr, FileService fss) {
        fileService = fss;
        this.postRepository = postRepository;
        notificationService = ns;
        followRepository = fr;
        reportRepository = rr;
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

    public void deletePost(UUID uId, Integer pID, String role) {
        Post toDelete = postRepository.findById(pID).orElseThrow(
                () -> new ResourceNotFoundException("Post not found"));
        System.out.println(role);
        if (role != "ADMIN" && !toDelete.getUser().getId().equals(uId)) {
            throw new AccessDeniedException("U can only edit your own posts");
        }
        postRepository.delete(toDelete);
        if (role == "ADMIN" && !toDelete.getUser().getId().equals(uId)) {
            notificationService.createNotification(
                    null,
                    toDelete.getUser(),
                    "/" + toDelete.getId(),
                    NotificationType.REMOVED);
        }
    }

    public void deletePost(Integer pID) {
        Post toDelete = postRepository.findById(pID).orElseThrow(
                () -> new ResourceNotFoundException("Post not found"));
        postRepository.delete(toDelete);
        notificationService.createNotification(
                null,
                toDelete.getUser(),
                "/" + toDelete.getId(),
                NotificationType.REMOVED);
    }

    public void hidePost(Integer pID) {
        Post toHide = postRepository.findById(pID).orElseThrow(
                () -> new ResourceNotFoundException("Post not found"));
        toHide.setHidden(true);
        reportRepository.updateReports(pID, state.ACTION_TAKEN);
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
        reportRepository.updateReports(pID, state.DISMISSED);
        toHide.setHidden(false);
        postRepository.save(toHide);
    }

    public Stat count() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        Long all = postRepository.count();
        long lastWeek = postRepository.countByCreatedAtAfter(oneWeekAgo);
        long prec = 0;
        if (all != 0) {
            prec = lastWeek / all * 100;
        }
        return new Stat(all, prec);
    }

    private static final String NEW_MEDIA_PLACEHOLDER = "NEW_MEDIA_PLACEHOLDER_";

    private final FileService fileService;

    @Transactional
    public Post createPostWithMedia(String description, String title, User user, List<MultipartFile> mediaFiles) {

        List<String> newMediaUrls = new ArrayList<>();
        if (mediaFiles != null) {
            for (MultipartFile file : mediaFiles) {
                String url = fileService.save(file);
                newMediaUrls.add(url);
            }
        }

        String finalDescription = replacePlaceholders(description, newMediaUrls);

        Post post = new Post();
        post.setTitle(title);
        post.setDescription(finalDescription);
        post.setUser(user);
        post.setMedia(newMediaUrls);
        System.out.println(newMediaUrls);

        return postRepository.save(post);
    }

    // --- EDIT POST ---
    @Transactional
    public Post editPostWithMedia(UUID userId, Integer postId, String description, String title,
            List<String> keepMedia, List<MultipartFile> newMedia) {

        // 1. Get post and verify ownership
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found")); // Use custom exception

        if (!post.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You can only edit your own posts");
        }

        // 2. Save all *new* media files
        List<String> newMediaUrls = new ArrayList<>();
        if (newMedia != null) {
            for (MultipartFile file : newMedia) {
                String url = fileService.save(file);
                newMediaUrls.add(url);
            }
        }

        // 3. Replace placeholders in the description HTML
        String finalDescription = replacePlaceholders(description, newMediaUrls);

        // 5. Update post fields
        post.setTitle(title);
        post.setDescription(finalDescription);
        List<String> oldMedia = post.getMedia();

        if (oldMedia != null) {
            for (String media : oldMedia) {
                System.out.println(media);
                if (keepMedia == null || !keepMedia.contains(media)) {
                    fileService.delete(media);
                }
            }
        }
        if (keepMedia != null) {
            if (newMediaUrls != null) {
                keepMedia.addAll(newMediaUrls);
            }
            post.setMedia(keepMedia);

        } else {
            post.setMedia(newMediaUrls);

        }
        return postRepository.save(post);
    }

    /**
     * Replaces placeholders like "NEW_MEDIA_PLACEHOLDER_0" with final URLs.
     */
    private String replacePlaceholders(String description, List<String> newMediaUrls) {
        if (description == null || newMediaUrls == null || newMediaUrls.isEmpty()) {
            return description;
        }

        String finalDescription = description;
        for (int i = 0; i < newMediaUrls.size(); i++) {
            String placeholder = NEW_MEDIA_PLACEHOLDER + i;
            String finalUrl = newMediaUrls.get(i);
            // Use replaceAll in case the placeholder appears multiple times, though it
            // shouldn't
            finalDescription = finalDescription.replaceAll(placeholder, finalUrl);
        }
        return finalDescription;
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
