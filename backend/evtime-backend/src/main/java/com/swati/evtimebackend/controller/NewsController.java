package com.swati.evtimebackend.controller;

import com.swati.evtimebackend.dto.CategoryStatsDTO;
import com.swati.evtimebackend.dto.NewsRequestDTO;
import com.swati.evtimebackend.dto.NewsResponseDTO;
import com.swati.evtimebackend.dto.PagedResponseDTO;
import com.swati.evtimebackend.service.NewsApiService;
import com.swati.evtimebackend.service.NewsService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
public class NewsController {

    private static final Logger log = LoggerFactory.getLogger(NewsController.class);

    private final NewsService newsService;
    private final NewsApiService newsApiService;

    public NewsController(NewsService newsService, NewsApiService newsApiService) {
        this.newsService = newsService;
        this.newsApiService = newsApiService;
    }

    @GetMapping("/news")
    public PagedResponseDTO<NewsResponseDTO> getAllNews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        return newsService.getAllNews(page, size, sortBy, direction);
    }

    /**
     * Combined filter endpoint — any parameter may be omitted. Kept as a new
     * addition (doesn't replace /news/filter, which the current frontend
     * still calls with just category+keyword) so existing integrations don't
     * need to change to benefit from richer filtering.
     */
    @GetMapping("/news/browse")
    public PagedResponseDTO<NewsResponseDTO> browseNews(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate publishedAfter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        return newsService.getFilteredNews(category, source, state, keyword, publishedAfter, page, size, sortBy, direction);
    }

    @GetMapping("/news/search")
    public List<NewsResponseDTO> searchNews(@RequestParam String keyword) {
        return newsService.searchNews(keyword);
    }

    @PostMapping("/news/create")
    public ResponseEntity<NewsResponseDTO> createNews(@Valid @RequestBody NewsRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(newsService.createNews(request));
    }

    @GetMapping("/news/{id}")
    public NewsResponseDTO getNewsById(@PathVariable Long id) {
        return newsService.getNewsById(id);
    }

    @PutMapping("/news/update/{id}")
    public NewsResponseDTO updateNews(@PathVariable Long id, @Valid @RequestBody NewsRequestDTO request) {
        return newsService.updateNews(id, request);
    }

    @DeleteMapping("/news/delete/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/news/category/{category}")
    public List<NewsResponseDTO> getNewsByCategory(@PathVariable String category) {
        return newsService.getNewsByCategory(category);
    }

    @GetMapping("/news/filter")
    public List<NewsResponseDTO> filterNews(@RequestParam String category, @RequestParam String keyword) {
        return newsService.filterNews(category, keyword);
    }

    @PostMapping("/news/fetch-latest")
    public ResponseEntity<String> fetchLatestNews() {
        log.info("Manual news fetch triggered");
        newsApiService.fetchAndSaveNews();
        return ResponseEntity.ok("Latest EV news fetched successfully");
    }

    @GetMapping("/analytics/category")
    public List<CategoryStatsDTO> getCategoryStats() {
        return newsService.getCategoryStats();
    }

    @GetMapping("/news/popular")
    public List<NewsResponseDTO> getPopularNews() {
        return newsService.getPopularNews();
    }

    @GetMapping("/admin/news/pending")
    public List<NewsResponseDTO> getPendingNews() {
        return newsService.getPendingNews();
    }

    @PutMapping("/admin/news/{id}/approve")
    public NewsResponseDTO approveNews(@PathVariable Long id) {
        return newsService.approveNews(id);
    }

    @PutMapping("/admin/news/{id}/reject")
    public NewsResponseDTO rejectNews(@PathVariable Long id) {
        return newsService.rejectNews(id);
    }

    @GetMapping("/news/state/{state}")
    public PagedResponseDTO<NewsResponseDTO> getNewsByState(
            @PathVariable String state,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        return newsService.getNewsByState(state, page, size, sortBy, direction);
    }
}
