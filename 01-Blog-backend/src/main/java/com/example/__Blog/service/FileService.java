package com.example.__Blog.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Service
public class FileService {

    // You can put this in application.properties
    @Value("${media.upload-dir:src/main/resources/static/posts/}")
    private String staticDir;

    @Value("${media.file-serve-url:/api/files/}")
    private String fileServeUrl;
    
    private final Path rootLocation;

    public FileService(@Value("${media.upload-dir:src/main/resources/static/posts/}") String staticDir) {
        this.rootLocation = Paths.get(staticDir);
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    /**
     * Saves a file and returns its full, servable URL.
     */
    public String save(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file.");
            }
            
            String contentType = file.getContentType();
            String extension = (contentType != null) ? contentType.substring(contentType.lastIndexOf('/') + 1) : "";
            if (extension.isEmpty()) {
                extension = "bin"; // default extension
            }
            
            String fileName = UUID.randomUUID() + "." + extension;
            Path destinationFile = this.rootLocation.resolve(fileName);

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }
            
            // Return the full URL
            // Assumes your FileController is at "/api/files/{filename}"
            return ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path(fileServeUrl)
                    .path(fileName)
                    .toUriString();
                    
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.", e);
        }
    }

    /**
     * Deletes a file given its full URL.
     */
    public void delete(String fileUrl) {
        try {
            // Extract filename from the full URL
            String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            Path file = rootLocation.resolve(fileName);
            System.out.println(fileName);
            System.out.println("chabach");
            System.out.println( Files.deleteIfExists(file));
        } catch (Exception e) {
            // Log this error, but don't fail the transaction
            System.err.println("Failed to delete file: " + fileUrl + " - " + e.getMessage());
        }
    }
}