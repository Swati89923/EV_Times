package com.swati.evtimebackend.repository;

import com.swati.evtimebackend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository
        extends JpaRepository<Comment, Long> {

    List<Comment> findByNewsIdOrderByCreatedAtDesc(
            Long newsId
    );
}