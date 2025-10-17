package com.example.__Blog.service;

import java.sql.Timestamp;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
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

    public Comment AddComment(String content, Integer pId, UUID uID) {
        User user = uRepository.findById(uID).get();
        Post post = pRepository.findById(pId).get();
        Comment comment = new Comment();
        comment.setText(content);
        comment.setPost(post);
        comment.setUser(user);
        comment.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        return commentRepository.save(comment);
    }
}
