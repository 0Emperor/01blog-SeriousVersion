package com.example.__Blog.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {
    private final Path root = Paths.get("src/main/resources/static/posts/");

    public FileStorageService() throws IOException {
        if (!Files.exists(root)) Files.createDirectories(root);
    }

    public String save(MultipartFile file) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path target = root.resolve(fileName);
        Files.copy(file.getInputStream(), target);
        return fileName;
    }
}
