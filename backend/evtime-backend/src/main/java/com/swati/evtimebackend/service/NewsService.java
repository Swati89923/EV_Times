package com.swati.evtimebackend.service;

import com.swati.evtimebackend.dto.CategoryStatsDTO;
import com.swati.evtimebackend.dto.NewsRequestDTO;
import com.swati.evtimebackend.dto.NewsResponseDTO;
import com.swati.evtimebackend.dto.PagedResponseDTO;
import com.swati.evtimebackend.entity.News;
import com.swati.evtimebackend.exception.ResourceNotFoundException;
import com.swati.evtimebackend.mapper.NewsMapper;
import com.swati.evtimebackend.repository.NewsRepository;
import com.swati.evtimebackend.specification.NewsSpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
public class NewsService {

    private static final Logger log = LoggerFactory.getLogger(NewsService.class);

    // Whitelist of columns callers may sort by
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "id",
            "title",
            "views",
            "publishedAt",
            "category"
    );

    private final NewsRepository newsRepository;

    public NewsService(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    private Pageable buildPageable(
            int page,
            int size,
            String sortBy,
            String direction
    ) {
        String safeSortBy = ALLOWED_SORT_FIELDS.contains(sortBy)
                ? sortBy
                : "id";

        Sort sort = "desc".equalsIgnoreCase(direction)
                ? Sort.by(safeSortBy).descending()
                : Sort.by(safeSortBy).ascending();

        int safeSize = Math.min(Math.max(size, 1), 100);

        return PageRequest.of(
                Math.max(page, 0),
                safeSize,
                sort
        );
    }

    @Cacheable(
            value = "allNews",
            key = "#page + '-' + #size + '-' + #sortBy + '-' + #direction"
    )
    public PagedResponseDTO<NewsResponseDTO> getAllNews(
            int page,
            int size,
            String sortBy,
            String direction
    ) {
        Pageable pageable = buildPageable(
                page,
                size,
                sortBy,
                direction
        );

        Page<News> result =
                newsRepository.findByStatusIgnoreCase(
                        "PUBLISHED",
                        pageable
                );

        return PagedResponseDTO.from(
                result,
                NewsMapper::toResponse
        );
    }

    @Cacheable(
            value = "filteredNews",
            key = "#category + '-' + #source + '-' + #state + '-' + #keyword + '-' + #publishedAfter + '-' + #page + '-' + #size + '-' + #sortBy + '-' + #direction"
    )
    public PagedResponseDTO<NewsResponseDTO> getFilteredNews(
            String category,
            String source,
            String state,
            String keyword,
            LocalDate publishedAfter,
            int page,
            int size,
            String sortBy,
            String direction
    ) {
        Specification<News> spec = Specification
                .where(NewsSpecification.withStatus("PUBLISHED"))
                .and(NewsSpecification.withCategory(category))
                .and(NewsSpecification.withSource(source))
                .and(NewsSpecification.withState(state))
                .and(NewsSpecification.withKeyword(keyword))
                .and(NewsSpecification.publishedAfter(publishedAfter));

        Page<News> result = newsRepository.findAll(
                spec,
                buildPageable(
                        page,
                        size,
                        sortBy,
                        direction
                )
        );

        return PagedResponseDTO.from(
                result,
                NewsMapper::toResponse
        );
    }

    @CacheEvict(
            value = {
                    "popularNews",
                    "allNews",
                    "categoryNews",
                    "stateNews",
                    "filteredNews"
            },
            allEntries = true
    )
    public NewsResponseDTO createNews(NewsRequestDTO dto) {

        News news = NewsMapper.toEntity(dto);

        news.setStatus("PENDING");

        News saved = newsRepository.save(news);

        log.info(
                "Created news id={} status=PENDING",
                saved.getId()
        );

        return NewsMapper.toResponse(saved);
    }

    @Transactional
    public NewsResponseDTO getNewsById(Long id) {

        News news = findOrThrow(id);

        if (news.getViews() == null) {
            news.setViews(0L);
        }

        news.setViews(news.getViews() + 1);

        return NewsMapper.toResponse(
                newsRepository.save(news)
        );
    }

    @CacheEvict(
            value = {
                    "popularNews",
                    "allNews",
                    "categoryNews",
                    "stateNews",
                    "filteredNews"
            },
            allEntries = true
    )
    public void deleteNews(Long id) {

        News news = findOrThrow(id);

        newsRepository.delete(news);

        log.info(
                "Deleted news id={}",
                id
        );
    }

    @CacheEvict(
            value = {
                    "popularNews",
                    "allNews",
                    "categoryNews",
                    "stateNews",
                    "filteredNews"
            },
            allEntries = true
    )
    public NewsResponseDTO updateNews(
            Long id,
            NewsRequestDTO dto
    ) {

        News news = findOrThrow(id);

        NewsMapper.applyToEntity(dto, news);

        News saved = newsRepository.save(news);

        log.info(
                "Updated news id={}",
                id
        );

        return NewsMapper.toResponse(saved);
    }

    @Cacheable(
            value = "categoryNews",
            key = "#category"
    )
    public List<NewsResponseDTO> getNewsByCategory(
            String category
    ) {

        log.debug(
                "Cache miss for category '{}' — querying database",
                category
        );

        return newsRepository
                .findByCategoryIgnoreCase(category)
                .stream()
                .map(NewsMapper::toResponse)
                .toList();
    }

    public List<NewsResponseDTO> searchNews(
            String keyword
    ) {

        return newsRepository
                .findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(NewsMapper::toResponse)
                .toList();
    }

    public List<NewsResponseDTO> filterNews(
            String category,
            String keyword
    ) {

        return newsRepository
                .findByCategoryAndTitleContainingIgnoreCase(
                        category,
                        keyword
                )
                .stream()
                .map(NewsMapper::toResponse)
                .toList();
    }

    @Cacheable(value = "popularNews")
    public List<NewsResponseDTO> getPopularNews() {

        log.debug(
                "Cache miss for popularNews — querying database"
        );

        return newsRepository
                .findTop5ByOrderByViewsDesc()
                .stream()
                .map(NewsMapper::toResponse)
                .toList();
    }

    public List<CategoryStatsDTO> getCategoryStats() {

        return newsRepository
                .getCategoryStats()
                .stream()
                .map(row ->
                        new CategoryStatsDTO(
                                (String) row[0],
                                (Long) row[1]
                        )
                )
                .toList();
    }

    @Cacheable(
            value = "stateNews",
            key = "#state + '-' + #page + '-' + #size + '-' + #sortBy + '-' + #direction"
    )
    public PagedResponseDTO<NewsResponseDTO> getNewsByState(
            String state,
            int page,
            int size,
            String sortBy,
            String direction
    ) {

        Page<News> result =
                newsRepository.findByStateIgnoreCaseAndStatusIgnoreCase(
                        state,
                        "PUBLISHED",
                        buildPageable(
                                page,
                                size,
                                sortBy,
                                direction
                        )
                );

        return PagedResponseDTO.from(
                result,
                NewsMapper::toResponse
        );
    }

    public List<NewsResponseDTO> getPendingNews() {

        return newsRepository
                .findByStatusIgnoreCaseOrderByIdDesc("PENDING")
                .stream()
                .map(NewsMapper::toResponse)
                .toList();
    }

    @CacheEvict(
            value = {
                    "popularNews",
                    "allNews",
                    "categoryNews",
                    "stateNews",
                    "filteredNews"
            },
            allEntries = true
    )
    public NewsResponseDTO approveNews(Long id) {

        News news = findOrThrow(id);

        news.setStatus("PUBLISHED");

        News saved = newsRepository.save(news);

        log.info(
                "Approved news id={}",
                id
        );

        return NewsMapper.toResponse(saved);
    }

    @CacheEvict(
            value = {
                    "popularNews",
                    "allNews",
                    "categoryNews",
                    "stateNews",
                    "filteredNews"
            },
            allEntries = true
    )
    public NewsResponseDTO rejectNews(Long id) {

        News news = findOrThrow(id);

        news.setStatus("REJECTED");

        News saved = newsRepository.save(news);

        log.info(
                "Rejected news id={}",
                id
        );

        return NewsMapper.toResponse(saved);
    }

    public List<NewsResponseDTO> getLatestBreakingNews() {

        return newsRepository
                .findTop10ByStatusIgnoreCaseOrderByIdDesc("PUBLISHED")
                .stream()
                .map(NewsMapper::toResponse)
                .toList();
    }

    private News findOrThrow(Long id) {

        return newsRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "News not found with id " + id
                        )
                );
    }
}