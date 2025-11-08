package com.example.__Blog.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
public class FileController {
    private final String staticDir = "src/main/resources/static/posts/";
    
    // --- NEW: Define your fallback filenames ---
    private final String FALLBACK_IMAGE = "404.png";
    private final String FALLBACK_VIDEO = "404.mp4";

    @PostMapping
    public ResponseEntity<Map<String,String>> staticFile(@RequestParam("file") MultipartFile file) throws IOException {
        String contentType = file.getContentType(); // e.g. "image/png"
        String extension = (contentType != null) ? contentType.substring(contentType.lastIndexOf('/') + 1) : ""; // "png"
        
        // A simple way to get a common extension
        if (contentType != null && contentType.startsWith("image/")) {
            extension = contentType.substring(contentType.lastIndexOf('/') + 1);
        } else if (contentType != null && contentType.startsWith("video/")) {
            extension = contentType.substring(contentType.lastIndexOf('/') + 1);
        } else {
            extension = "bin"; // Default for unknown
        }

        String fileName = UUID.randomUUID() + "." + extension;
        Path filePath = Paths.get(staticDir + fileName);
        Files.createDirectories(filePath.getParent());
        Files.copy(file.getInputStream(), filePath,
        StandardCopyOption.REPLACE_EXISTING);
        Map<String,String> r = Map.of("url",fileName);
        return ResponseEntity.ok(r);
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<UrlResource> getFile(@PathVariable String filename) throws IOException {
        Path filePath = Paths.get(staticDir).resolve(filename).normalize();
        UrlResource resource = new UrlResource(filePath.toUri());

        // --- NEW: Fallback Logic ---
        if (!resource.exists()) {
            // The requested file does not exist, load a fallback
            String fallbackFilename;
            
            if (isImageExtension(filename)) {
                fallbackFilename = FALLBACK_IMAGE;
            } else if (isVideoExtension(filename)) {
                fallbackFilename = FALLBACK_VIDEO;
            } else {
                // Default to image if the type is unknown
                fallbackFilename = FALLBACK_IMAGE;
            }

            filePath = Paths.get(staticDir).resolve(fallbackFilename).normalize();
            resource = new UrlResource(filePath.toUri());

            // If the fallback itself is missing, we have a problem.
            if (!resource.exists()) {
                 throw new FileNotFoundException("File not found " + filename + " and fallback " + fallbackFilename + " is also missing.");
            }
        }
        // --- End of New Logic ---

        String contentType = Files.probeContentType(filePath);
        if (contentType == null) {
            // Guess content type if probing fails
            if (isImageExtension(filename)) {
                contentType = "image/jpeg"; // Default image
            } else if (isVideoExtension(filename)) {
                contentType = "video/mp4"; // Default video
            } else {
                contentType = "application/octet-stream";
            }
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    /**
     * Helper to check for common image extensions
     */
    private boolean isImageExtension(String filename) {
        if (filename == null) return false;
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
        if (filename == null) return false;
        String lowerCaseFile = filename.toLowerCase();
        return lowerCaseFile.endsWith(".mp4") ||
               lowerCaseFile.endsWith(".webm") ||
               lowerCaseFile.endsWith(".ogg");
    }
}