package com.example.__Blog.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import jakarta.annotation.PostConstruct;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.__Blog.exception.FileStorageException;

@RestController
@RequestMapping("/api/files")
public class FileController {
    @Value("${file.upload-dir}")
    private String staticDir;

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(staticDir));
        } catch (IOException e) {
            throw new FileStorageException("Could not create upload directory!");
        }
    }

    // --- NEW: Define your fallback filenames ---
    private final String FALLBACK_IMAGE = "404.png";
    private final String FALLBACK_VIDEO = "404.mp4";

    @GetMapping("/{filename:.+}")
    public ResponseEntity<?> getFile(@PathVariable String filename) {
        try {
            // Resolve path
            Path filePath = Paths.get(staticDir).resolve(filename).normalize();
            UrlResource resource = new UrlResource(filePath.toUri());
            // ‣ If file not found → fallback
            if (!resource.exists() || !resource.isReadable()) {
                String fallback = chooseFallback(filename);

                filePath = Paths.get(staticDir).resolve(fallback).normalize();
                resource = new UrlResource(filePath.toUri());

                if (!resource.exists() || !resource.isReadable()) {
                    // The fallback is missing → plain text error (prevents JSON/image conflict)
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .contentType(MediaType.TEXT_PLAIN)
                            .body("File not found: " + filename);
                }
            }

            String contentType = safeProbeContentType(filePath, filename);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (Exception ex) {

            return ResponseEntity.status(500)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("Could not load file: " + filename);
        }
    }

    private String chooseFallback(String filename) {
        if (isImageExtension(filename))
            return FALLBACK_IMAGE;
        if (isVideoExtension(filename))
            return FALLBACK_VIDEO;
        return FALLBACK_IMAGE; // default
    }

    private String safeProbeContentType(Path path, String filename) {
        try {
            String type = Files.probeContentType(path);
            if (type != null)
                return type;
        } catch (Exception ignored) {
        }

        // fallback guessing
        if (isImageExtension(filename))
            return "image/jpeg";
        if (isVideoExtension(filename))
            return "video/mp4";
        return "application/octet-stream";
    }

    /**
     * Helper to check for common image extensions
     */
    private boolean isImageExtension(String filename) {
        if (filename == null)
            return false;
        String lowerCaseFile = filename.toLowerCase();
        return lowerCaseFile.endsWith(".png") ||
                lowerCaseFile.endsWith(".jpg") ||
                lowerCaseFile.endsWith(".jpeg") ||
                lowerCaseFile.endsWith(".gif") ||
                lowerCaseFile.endsWith(".webp");
    }

    /**
     * Helper to check for common video extensions
     */
    private boolean isVideoExtension(String filename) {
        if (filename == null)
            return false;
        String lowerCaseFile = filename.toLowerCase();
        return lowerCaseFile.endsWith(".mp4") ||
                lowerCaseFile.endsWith(".webm") ||
                lowerCaseFile.endsWith(".ogg");
    }
}