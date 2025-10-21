package com.example.__Blog.service;

import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.example.__Blog.model.User;
import com.example.__Blog.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsersNotFollowed(UUID userId) {
        return userRepository.findUsersNotFollowedBy(userId);
    }
    
    public User createUser(User user) {
        try {
            return userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            return null;
        }
    }

    public User getUser(UUID id) {
        return userRepository.findById(id)
               .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    public User getUser(String name) {
        return userRepository.findByUsername(name)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
   

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }
}
