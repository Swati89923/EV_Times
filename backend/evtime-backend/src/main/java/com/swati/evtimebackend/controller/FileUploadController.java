package com.swati.evtimebackend.controller;

import com.swati.evtimebackend.dto.FileUploadResponseDTO;
import com.swati.evtimebackend.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Set;
import java.util.UUID;

@RestController
public class FileUploadController {

    private static final Logger log = LoggerFactory.getLogger(FileUploadController.class);

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );
    private static final long MAX_FILE_SIZE_BYTES = 5L * 1024 * 1024; // 5 MB

    @PostMapping("/upload")
    public FileUploadResponseDTO uploadFile(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded file is empty.");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new BadRequestException("File exceeds the 5MB upload limit.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Only JPEG, PNG, WEBP, and GIF images are allowed.");
        }

        String extension = switch (contentType.toLowerCase()) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> "";
        };

        // Random filename instead of the caller-supplied original filename:
        // trusting the client's filename allows overwriting existing files
        // (including files outside the intended directory via "../" in the
        // name) and collisions between uploads.
        String storedFilename = UUID.randomUUID() + extension;

        String uploadDir = System.getProperty("user.dir") + "/uploads/";
        Path uploadPath = Path.of(uploadDir);
        Files.createDirectories(uploadPath);

        Path target = uploadPath.resolve(storedFilename).normalize();
        if (!target.startsWith(uploadPath)) {
            // Defense in depth — the generated filename can't contain path
            // separators, but this guards against any future change that
            // reintroduces caller-controlled path segments.
            throw new BadRequestException("Invalid upload target.");
        }

        file.transferTo(new File(target.toString()));
        log.info("Uploaded file stored as {}", storedFilename);

        String imageUrl = "http://localhost:8080/uploads/" + storedFilename;
        return new FileUploadResponseDTO(imageUrl);
    }
}
