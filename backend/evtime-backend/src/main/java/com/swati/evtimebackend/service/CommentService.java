package com.swati.evtimebackend.service;

import com.swati.evtimebackend.dto.CommentRequestDTO;
import com.swati.evtimebackend.dto.CommentResponseDTO;

import java.util.List;

public interface CommentService {

    CommentResponseDTO addComment(Long newsId, String authorEmail, CommentRequestDTO request);

    List<CommentResponseDTO> getCommentsByNews(Long newsId);

    /**
     * @param requesterEmail email of the currently authenticated user (from the JWT),
     *                        used to enforce that only the comment's author or an admin
     *                        can delete it. Passing this in explicitly instead of trusting
     *                        the client-supplied id alone closes an IDOR-style gap where
     *                        any authenticated user could delete anyone's comment.
     * @param isAdmin         true if the requester holds the ADMIN role and can bypass ownership
     */
    void deleteComment(Long id, String requesterEmail, boolean isAdmin);
}
