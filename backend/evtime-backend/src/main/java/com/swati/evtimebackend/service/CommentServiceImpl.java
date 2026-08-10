package com.swati.evtimebackend.service;

import com.swati.evtimebackend.dto.CommentRequestDTO;
import com.swati.evtimebackend.dto.CommentResponseDTO;
import com.swati.evtimebackend.entity.Comment;
import com.swati.evtimebackend.entity.News;
import com.swati.evtimebackend.exception.ResourceNotFoundException;
import com.swati.evtimebackend.mapper.CommentMapper;
import com.swati.evtimebackend.repository.CommentRepository;
import com.swati.evtimebackend.repository.NewsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class CommentServiceImpl implements CommentService {
    private static final Logger log = LoggerFactory.getLogger(CommentServiceImpl.class);
    private final CommentRepository commentRepository;
    private final NewsRepository newsRepository;
    public CommentServiceImpl(
            CommentRepository commentRepository,
            NewsRepository newsRepository
    ) {
        this.commentRepository = commentRepository;
        this.newsRepository = newsRepository;
    }

    @Override
    public CommentResponseDTO addComment(Long newsId, String authorEmail, CommentRequestDTO request) {
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new ResourceNotFoundException("News not found with id " + newsId));
        Comment comment = new Comment();
        comment.setUserEmail(authorEmail);
        comment.setMessage(request.getMessage());
        comment.setNews(news);
        Comment saved = commentRepository.save(comment);
        log.info("Comment added to news id={} by {}", newsId, authorEmail);
        return CommentMapper.toResponse(saved);
    }
    @Override
    public List<CommentResponseDTO> getCommentsByNews(Long newsId) {
        return commentRepository.findByNewsIdOrderByCreatedAtDesc(newsId)
                .stream().map(CommentMapper::toResponse).toList();
    }

    @Override
    public void deleteComment(Long id, String requesterEmail, boolean isAdmin) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id " + id));
        boolean isOwner = comment.getUserEmail() != null && comment.getUserEmail().equalsIgnoreCase(requesterEmail);

        if (!isAdmin && !isOwner) {
            log.warn("User {} attempted to delete comment {} they don't own", requesterEmail, id);
            throw new AccessDeniedException("You can only delete your own comments.");
        }
        commentRepository.deleteById(id);
        log.info("Comment id={} deleted by {}", id, requesterEmail);
    }
}