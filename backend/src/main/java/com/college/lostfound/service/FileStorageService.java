package com.college.lostfound.service;

import com.college.lostfound.config.AppProperties;
import com.college.lostfound.exception.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class FileStorageService {
    private final AppProperties props;
    private final Path uploadDir;

    public FileStorageService(AppProperties props) {
        this.props = props;
        this.uploadDir = Path.of(props.getUpload().getDir()).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to create upload directory: " + uploadDir, e);
        }
    }

    public String storeImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is required");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
            throw new BadRequestException("Only image uploads are allowed");
        }

        String ext = extension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + (ext.isBlank() ? "" : ("." + ext));
        Path target = uploadDir.resolve(filename).normalize();
        if (!target.startsWith(uploadDir)) {
            throw new BadRequestException("Invalid file path");
        }
        try {
            Files.copy(file.getInputStream(), target);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store file", e);
        }

        String publicPath = props.getUpload().getPublicPath();
        if (!publicPath.startsWith("/")) publicPath = "/" + publicPath;
        if (publicPath.endsWith("/")) publicPath = publicPath.substring(0, publicPath.length() - 1);
        return publicPath + "/" + filename;
    }

    private String extension(String originalFilename) {
        if (originalFilename == null) return "";
        String name = originalFilename.trim();
        int dot = name.lastIndexOf('.');
        if (dot < 0 || dot == name.length() - 1) return "";
        String ext = name.substring(dot + 1).toLowerCase();
        return ext.replaceAll("[^a-z0-9]+", "");
    }
}

