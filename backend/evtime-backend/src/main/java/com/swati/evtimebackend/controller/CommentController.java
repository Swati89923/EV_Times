package com.swati.evtimebackend.controller;

import com.swati.evtimebackend.dto.CommentRequestDTO;
import com.swati.evtimebackend.dto.CommentResponseDTO;
import com.swati.evtimebackend.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/{newsId}")
    public ResponseEntity<CommentResponseDTO> addComment(
            @PathVariable Long newsId,
            @Valid @RequestBody CommentRequestDTO request,
            Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commentService.addComment(newsId, authentication.getName(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id, Authentication authentication) {
        String requesterEmail = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_ADMIN"));

        commentService.deleteComment(id, requesterEmail, isAdmin);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{newsId}")
    public List<CommentResponseDTO> getComments(@PathVariable Long newsId) {
        return commentService.getCommentsByNews(newsId);
    }
}
