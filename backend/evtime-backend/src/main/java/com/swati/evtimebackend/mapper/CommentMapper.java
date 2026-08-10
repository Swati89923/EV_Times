package com.swati.evtimebackend.mapper;

import com.swati.evtimebackend.dto.CommentResponseDTO;
import com.swati.evtimebackend.entity.Comment;

public final class CommentMapper {

    private CommentMapper() {
    }

    public static CommentResponseDTO toResponse(Comment comment) {
        if (comment == null) return null;
        return new CommentResponseDTO(
                comment.getId(),
                comment.getUserEmail(),
                comment.getMessage(),
                comment.getCreatedAt(),
                comment.getNews() != null ? comment.getNews().getId() : null
        );
    }
}
