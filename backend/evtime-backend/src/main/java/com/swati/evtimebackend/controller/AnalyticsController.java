package com.swati.evtimebackend.controller;

import com.swati.evtimebackend.dto.AnalyticsDTO;
import com.swati.evtimebackend.repository.CommentRepository;
import com.swati.evtimebackend.repository.NewsRepository;
import com.swati.evtimebackend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    private final NewsRepository newsRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    public AnalyticsController(
            NewsRepository newsRepository,
            UserRepository userRepository,
            CommentRepository commentRepository
    ) {
        this.newsRepository = newsRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    @GetMapping
    public AnalyticsDTO getAnalytics() {

        return new AnalyticsDTO(

                newsRepository.count(),

                userRepository.count(),

                commentRepository.count()
        );
    }
}