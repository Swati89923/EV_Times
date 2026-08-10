package com.swati.evtimebackend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

/**
 * Consistent error shape returned by every failure path in the API
 * (validation errors, not-found, auth failures, unexpected exceptions)
 * instead of ad hoc Map<String,Object> bodies that differed per handler.
 */
public class ErrorResponseDTO {

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp = LocalDateTime.now();

    private int status;
    private String message;
    private String path;

    public ErrorResponseDTO() {
    }

    public ErrorResponseDTO(int status, String message, String path) {
        this.status = status;
        this.message = message;
        this.path = path;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}
