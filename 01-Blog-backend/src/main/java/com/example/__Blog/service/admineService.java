package com.example.__Blog.service;


import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.__Blog.model.User;
import com.example.__Blog.repository.UserRepository;
@Service
public class admineService {
    private final UserRepository userRepository;
    private PasswordEncoder passwordEncoder; 

    public admineService(UserRepository userRepository,PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder=passwordEncoder;
    }

    public User createAdmin(String username,String name ,String bio,String password,String profile) {
        User user = new User();

        user.setPassword(passwordEncoder.encode(password));
        user.setUsername(username);
        user.setProfile(profile);
        user.setRole(true);
        user.setName(name);
        user.setBio(bio);
        if (userRepository.findByUsername(username).orElse(null)!=null) {
            return user;
        }
        try {
            return userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            return null;
        }
    }
}
