package com.example.__Blog.service;

import java.sql.Timestamp;
import java.util.UUID;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.domain.Page;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.example.__Blog.model.Comment;
import com.example.__Blog.model.Post;
import com.example.__Blog.model.User;
import com.example.__Blog.repository.CommentRepository;
import com.example.__Blog.repository.PostRepository;
import com.example.__Blog.repository.UserRepository;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserRepository uRepository;
    private final PostRepository pRepository;

    @Autowired
    CommentService(CommentRepository cmt, UserRepository usr, PostRepository pst) {
        commentRepository = cmt;
        uRepository = usr;
        pRepository = pst;
    }

    public Integer CountComment(Integer pid) {
        return commentRepository.countByPostId(pid);
    }

    public Page<Comment> getCommentsPerPost(Integer id, PageRequest page) {
        return commentRepository.findAllByPostId(id, page);
    }

    public void deleteComment(Integer cId, UUID uId) {
        Comment c = commentRepository.findById(cId).orElseThrow(
                () -> new ResourceNotFoundException("comment not found"));
        if (!c.getUser().getId().equals(uId)) {
            throw new AccessDeniedException("You can only delete your own comments");
        }
        commentRepository.delete(c);

    }

    public Comment updaComment(String nContent, Integer cId, UUID uID) {
        Comment c = commentRepository.findById(cId).orElseThrow(
                () -> new ResourceNotFoundException("comment not found"));
        if (!c.getUser().getId().equals(uID)) {
            throw new AccessDeniedException("You can only update your own comments");
        }
        c.setText(nContent);
        return commentRepository.save(c);

    }

    public Comment AddComment(String content, Integer pId, UUID uID) {
        User user = uRepository.findById(uID).orElseThrow(
                () -> new ResourceNotFoundException("no such user"));
        Post post = pRepository.findById(pId).orElseThrow(
                () -> new ResourceNotFoundException("post not found"));
        ;
        Comment comment = new Comment();
        comment.setText(content);
        comment.setPost(post);
        comment.setUser(user);
        comment.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        return commentRepository.save(comment);
    }
}
