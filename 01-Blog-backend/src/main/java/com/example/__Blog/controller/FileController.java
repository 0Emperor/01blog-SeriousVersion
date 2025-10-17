package com.example.__Blog.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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

    @PostMapping
    public ResponseEntity<String> staticFile(@RequestParam("file") MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "";// + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(staticDir + fileName);
        Files.createDirectories(filePath.getParent());

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return ResponseEntity.ok(fileName);
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<UrlResource> getFile(@PathVariable String filename) throws IOException {
        Path filePath = Paths.get(staticDir).resolve(filename).normalize();
        UrlResource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            throw new FileNotFoundException("File not found " + filename);
        }
        String contentType = Files.probeContentType(filePath);
        if (contentType == null || !contentType.startsWith("image/")) {
            contentType = "image/jpeg"; 
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
