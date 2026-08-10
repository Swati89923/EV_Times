package com.swati.evtimebackend.dto;

import java.time.LocalDateTime;

public class CommentResponseDTO {

    private Long id;
    private String userEmail;
    private String message;
    private LocalDateTime createdAt;
    private Long newsId;

    public CommentResponseDTO() {
    }

    public CommentResponseDTO(Long id, String userEmail, String message, LocalDateTime createdAt, Long newsId) {
        this.id = id;
        this.userEmail = userEmail;
        this.message = message;
        this.createdAt = createdAt;
        this.newsId = newsId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getNewsId() {
        return newsId;
    }

    public void setNewsId(Long newsId) {
        this.newsId = newsId;
    }
}
