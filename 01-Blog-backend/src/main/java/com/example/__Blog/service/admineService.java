package com.example.__Blog.service;


import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.__Blog.model.User;
import com.example.__Blog.repository.UserRepository;
@Service
public class admineService {
    private final UserRepository userRepository;
    // private static final String SECRET_KEY = "RFULZCMtJy7jlSJSggido7KO+lzDnfdWnbZBC3ftdufc57HEzzE0RKIkgkPmHOMJoKIJBLuy39M3uGWwqf3vpQ==";
    private PasswordEncoder passwordEncoder; 

    public admineService(UserRepository userRepository,PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder=passwordEncoder;
    }

    public User createAdmin(String username, String password) {
        User user = new User();
        user.setPassword(passwordEncoder.encode(password));
        user.setUsername(username);
        user.setRole(true);
        try {
            return userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            System.out.println(e.getMessage());
            return null;
        }
    }
}
