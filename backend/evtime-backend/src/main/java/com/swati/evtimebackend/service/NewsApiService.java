package com.swati.evtimebackend.service;

import com.swati.evtimebackend.dto.NewsApiArticleDTO;
import com.swati.evtimebackend.dto.NewsApiResponseDTO;
import com.swati.evtimebackend.entity.News;
import com.swati.evtimebackend.repository.NewsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class NewsApiService {

    private static final Logger log = LoggerFactory.getLogger(NewsApiService.class);

    private static final Map<String, String> STATE_QUERIES = Map.ofEntries(
            Map.entry("Delhi", "Delhi EV"),
            Map.entry("Maharashtra", "Mumbai EV"),
            Map.entry("Karnataka", "Bangalore EV"),
            Map.entry("Tamil Nadu", "Chennai EV"),
            Map.entry("Telangana", "Hyderabad EV"),
            Map.entry("Gujarat", "Ahmedabad EV"),
            Map.entry("Uttar Pradesh", "Lucknow EV"),
            Map.entry("Rajasthan", "Jaipur EV"),
            Map.entry("Bihar", "Patna EV"),
            Map.entry("Odisha", "Bhubaneswar EV"),
            Map.entry("West Bengal", "Kolkata EV"),
            Map.entry("Kerala", "Kochi EV"),
            Map.entry("Assam", "Guwahati EV")
    );

    private final RestTemplate restTemplate;
    private final NewsRepository newsRepository;

    @Value("${news.api.key:}")
    private String apiKey;

    @Value("${news.fetch.enabled:true}")
    private boolean fetchEnabled;

    public NewsApiService(
            RestTemplate restTemplate,
            NewsRepository newsRepository) {

        this.restTemplate = restTemplate;
        this.newsRepository = newsRepository;
    }

    private void fetchStateNews(String query, String state) {

        String apiUrl =
                "https://newsapi.org/v2/everything?q="
                        + query
                        + "&language=en&sortBy=publishedAt&apiKey="
                        + apiKey;

        NewsApiResponseDTO response;
        try {
            response = restTemplate.getForObject(apiUrl, NewsApiResponseDTO.class);
        } catch (RestClientException e) {
            // One state's request failing (rate limit, network blip) shouldn't
            // abort the whole run — log it and move on to the next state.
            log.warn("News fetch failed for state={} query='{}': {}", state, query, e.getMessage());
            return;
        }

        if (response == null || response.getArticles() == null) {
            log.debug("No articles returned for state={} query='{}'", state, query);
            return;
        }

        int saved = 0;
        for (NewsApiArticleDTO article : response.getArticles()) {

            if (article.getTitle() == null || article.getTitle().isBlank()) {
                continue;
            }

            if (newsRepository.existsByTitleIgnoreCase(article.getTitle().trim())) {
                continue;
            }

            News news = new News();

            news.setTitle(article.getTitle());

            news.setDescription(
                    article.getDescription() != null
                            ? article.getDescription()
                            : "No description available."
            );

            news.setImageUrl(article.getUrlToImage());

            news.setAuthor(
                    article.getAuthor() != null
                            ? article.getAuthor()
                            : "EV Times"
            );

            news.setCategory(categorize(article.getTitle()));

            news.setUrl(article.getUrl());

            news.setPublishedAt(article.getPublishedAt());

            if (article.getSource() != null) {
                news.setSource(article.getSource().getName());
            }

            news.setState(state);

            newsRepository.save(news);
            saved++;
        }

        log.info("Fetched {} new articles for state={}", saved, state);
    }

    private String categorize(String rawTitle) {
        String title = rawTitle.toLowerCase();

        if (title.contains("battery")) {
            return "Battery";
        }
        if (title.contains("charge") || title.contains("charging") || title.contains("charger")) {
            return "Charging";
        }
        if (title.contains("tesla") || title.contains("car") || title.contains("vehicle")
                || title.contains("ev") || title.contains("hyundai") || title.contains("mahindra")
                || title.contains("tata") || title.contains("byd") || title.contains("kia")
                || title.contains("volvo") || title.contains("toyota") || title.contains("bmw")
                || title.contains("mercedes")) {
            return "Auto";
        }
        return "EV News";
    }

    /**
     * Runs automatically every hour (configurable via news.fetch.cron) and
     * can also be triggered manually via POST /news/fetch-latest. Guarded by
     * news.fetch.enabled so the job can be turned off in environments
     * without a NewsAPI key without the scheduler spamming warnings every hour.
     */
    @Scheduled(cron = "${news.fetch.cron:0 0 * * * *}")
    public void fetchAndSaveNews() {

        if (!fetchEnabled) {
            log.debug("Scheduled news fetch skipped — news.fetch.enabled=false");
            return;
        }

        if (apiKey == null || apiKey.isBlank()) {
            log.warn("Scheduled news fetch skipped — news.api.key is not configured");
            return;
        }

        log.info("Starting scheduled EV news fetch across {} states", STATE_QUERIES.size());

        STATE_QUERIES.forEach((state, query) -> fetchStateNews(query, state));

        log.info("State-wise fetch completed.");
    }
}
