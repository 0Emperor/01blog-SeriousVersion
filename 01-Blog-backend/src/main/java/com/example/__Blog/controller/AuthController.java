package com.example.__Blog.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.__Blog.helper.JwtUtil;
import com.example.__Blog.model.User;
import com.example.__Blog.service.CustomUserDetailsService;
import com.example.__Blog.service.UserService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

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
    private static final String SECRET_KEY = "RFULZCMtJy7jlSJSggido7KO+lzDnfdWnbZBC3ftdufc57HEzzE0RKIkgkPmHOMJoKIJBLuy39M3uGWwqf3vpQ==";

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            User savedUser = userService.createUser(user);

            if (savedUser == null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
            }
            String jwt = Jwts.builder()
                    .setSubject(savedUser.getUsername())
                    .claim("role", savedUser.getRole())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                    .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()), SignatureAlgorithm.HS256)
                    .compact();

            Map<String, Object> res = new HashMap<>();
            res.put("jwt", jwt);
            res.put("user", savedUser);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .header("Authorization", "Bearer " + jwt)
                    .body(res);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String jwt = jwtUtil.generateToken(userDetails);

        Map<String, String> response = new HashMap<>();
        response.put("jwt", jwt);
        return ResponseEntity.ok(response);
    }
}
