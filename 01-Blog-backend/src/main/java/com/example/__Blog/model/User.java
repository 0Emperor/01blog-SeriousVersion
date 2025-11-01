package com.example.__Blog.model;

import java.sql.Timestamp;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue()
    @Column(updatable = false, nullable = false)
    private UUID id;
    private boolean role;
    private String profile;
    private String bio;
    @Column(unique = true)
    private String username;
    @JsonIgnore
    private String password_hash;
    @CreationTimestamp
    private Timestamp created_at;
    private boolean isBaned = false;
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setBaned(boolean isBaned) {
        this.isBaned = isBaned;
    }

    public boolean getBaned() {
        return isBaned;
    }

    public String getProfile() {
        return profile;
    }

    public void setProfile(String profile) {
        this.profile = profile;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public Timestamp getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Timestamp created_at) {
        this.created_at = created_at;
    }

    @Override
    public String toString() {
        return username + role + created_at;
    }

    public String getPassword() {
        return password_hash;
    }

    public void setPassword(String password_hash) {
        this.password_hash = password_hash;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role ? "ADMIN" : "beta";
    }

    public void setRole(Boolean role) {
        this.role = role;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public UUID getId() {
        return id;
    }

}
