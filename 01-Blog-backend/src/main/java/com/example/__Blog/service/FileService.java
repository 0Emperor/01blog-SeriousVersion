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

import com.example.__Blog.exception.FileStorageException;
import com.example.__Blog.exception.InvalidFileException;

@Service
public class FileService {

    // You can put this in application.properties
    @Value("${file.upload-dir}")
    private String staticDir;

    @Value("${media.file-serve-url:/api/files/}")
    private String fileServeUrl;

    private final Path rootLocation;

    public FileService(@Value("${file.upload-dir}") String staticDir) {
        this.rootLocation = Paths.get(staticDir);
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new FileStorageException("Could not initialize storage", e);
        }
    }

    // Allowed extensions
    private static final java.util.Set<String> ALLOWED_EXTENSIONS = java.util.Set.of(
            "jpg", "jpeg", "png", "gif", "webp",
            "mp4", "webm", "ogg");

    @Value("${spring.servlet.multipart.max-file-size}")
    private org.springframework.util.unit.DataSize maxFileSize;

    /**
     * Saves a file and returns its full, servable URL.
     */
    public String save(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new InvalidFileException("Failed to store empty file.");
            }

            validateFile(file);

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
            throw new FileStorageException("Failed to store file.", e);
        }
    }

    private void validateFile(MultipartFile file) {
        // 1. Check size
        if (file.getSize() > maxFileSize.toBytes()) {
            throw new InvalidFileException("File size exceeds limit of " + maxFileSize);
        }

        // 2. Check extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new InvalidFileException("Invalid file: missing extension");
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new InvalidFileException("Invalid file type. Allowed: " + ALLOWED_EXTENSIONS);
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
            Files.deleteIfExists(file);
        } catch (Exception e) {
            // Log this error, but don't fail the transaction
            System.err.println("Failed to delete file: " + fileUrl + " - " + e.getMessage());
        }
    }
}