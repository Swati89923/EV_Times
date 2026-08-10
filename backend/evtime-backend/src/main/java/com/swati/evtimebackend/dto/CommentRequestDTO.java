package com.swati.evtimebackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * userEmail is intentionally NOT part of this DTO. It used to be
 * client-supplied in the request body, which meant an authenticated user
 * could post a comment "as" any email address they typed in. The author is
 * now derived server-side from the JWT subject in CommentController.
 */
public class CommentRequestDTO {

    @NotBlank(message = "Comment message cannot be empty")
    @Size(max = 1000, message = "Comment must be under 1000 characters")
    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
