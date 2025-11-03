package com.example.__Blog.service;

import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.__Blog.dto.Stat;
import com.example.__Blog.dto.UserRegister;
import com.example.__Blog.dto.Userdto;
import com.example.__Blog.model.User;
import com.example.__Blog.repository.UserRepository;

import jakarta.transaction.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public UserService(UserRepository userRepository, FileStorageService fs) {
        this.userRepository = userRepository;
        fileStorageService = fs;
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

    public User createUser(UserRegister user, String encodedPassword) throws IOException {
        User User = new User();
        User.setUsername(user.username());
        User.setPassword(encodedPassword);
        return userRepository.save(User);
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

    public List<User> get3RecentUsers() {
        return userRepository.findLast3Users(PageRequest.of(0, 3));
    }

    public Stat counts() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        Long all = userRepository.count();
        long lastWeek = userRepository.countByCreatedAtAfter(oneWeekAgo);
        long prec = 0;
        if (all != 0) {
            prec = lastWeek / all * 100;
        }
        return new Stat(all, prec);
    }

    @Transactional
    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    @Transactional
    public Userdto updateProfile(UUID uid, String username, String name, String bio, MultipartFile profile)
            throws IOException {
        User currentUser = userRepository.findById(uid)
                .orElseThrow(() -> new ResourceNotFoundException("user not found"));
        
        if (username != null && !username.isBlank()) {
            currentUser.setUsername(username);
        }

        if (bio != null) {
            currentUser.setBio(bio);
        }

        if (profile != null && !profile.isEmpty()) {
            String fileName = fileStorageService.save(profile);
            currentUser.setProfile(fileName);
        }
        if (name != null && !name.isBlank()) {
            currentUser.setName(name);
        }
        userRepository.save(currentUser);
        return Userdto.from(currentUser);
    }

    public void ban(UUID uid) {
        userRepository.banUser(uid);
    }

    public void unban(UUID uid) {
        userRepository.unbanUser(uid);
    }
}
