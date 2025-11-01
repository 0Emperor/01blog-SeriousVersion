package com.example.__Blog.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.__Blog.dto.UserLogindto;
import com.example.__Blog.dto.UserRegister;
import com.example.__Blog.helper.CustomUserDetails;
import com.example.__Blog.helper.JwtUtil;
import com.example.__Blog.model.User;
import com.example.__Blog.service.CustomUserDetailsService;
import com.example.__Blog.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/ooooyy")
    public String ooooyy() {
        return "ooooyy";
    }

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @ModelAttribute UserRegister userRegister) {
        // Encode the password
        String encodedPassword = passwordEncoder.encode(userRegister.password());
        User savedUser;
        try {
            savedUser = userService.createUser(userRegister, encodedPassword);

        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Username is already taken"));
        } catch(IOException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("error", "Something went wrong"));
        }
        // Generate JWT
        CustomUserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getUsername());
        String jwt = jwtUtil.generateToken(userDetails);

        // Build response
        Map<String, Object> res = new HashMap<>();
        res.put("jwt", jwt);
        res.put("user", savedUser);

        return ResponseEntity.status(HttpStatus.CREATED)
                .header("Authorization", "Bearer " + jwt)
                .body(res);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody UserLogindto loginDto) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.username(),
                        loginDto.password()));

        CustomUserDetails userDetails = userDetailsService.loadUserByUsername(loginDto.username());
        String jwt = jwtUtil.generateToken(userDetails);

        Map<String, String> response = new HashMap<>();
        response.put("jwt", jwt);
        return ResponseEntity.ok(response);
    }

}
