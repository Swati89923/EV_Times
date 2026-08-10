package com.swati.evtimebackend.controller;

import com.swati.evtimebackend.dto.NewsResponseDTO;
import com.swati.evtimebackend.entity.BreakingNews;
import com.swati.evtimebackend.service.BreakingNewsService;
import com.swati.evtimebackend.service.NewsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/breaking-news")
public class BreakingNewsController {
    private final NewsService newsService;
    private final BreakingNewsService service;

    public BreakingNewsController(
            BreakingNewsService service,
            NewsService newsService
    ) {
        this.service = service;
        this.newsService = newsService;
    }

    @PostMapping("/create")
    public BreakingNews create(
            @RequestBody BreakingNews news
    ) {
        return service.create(news);
    }

    @GetMapping
    public List<BreakingNews> getAll() {
        return service.getAll();
    }

    @GetMapping("/active")
    public List<NewsResponseDTO> active() {

        return newsService.getLatestBreakingNews();

    }

    @PatchMapping("/toggle/{id}")
    public void toggle(
            @PathVariable Long id
    ) {
        service.toggle(id);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(
            @PathVariable Long id
    ) {
        service.delete(id);
    }
}