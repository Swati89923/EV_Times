package com.swati.evtimebackend.ai;

import com.swati.evtimebackend.dto.SummaryRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private static final Logger log = LoggerFactory.getLogger(AIController.class);

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/chat")
    public String chat(@RequestParam String message) {
        log.debug("AI chat request received ({} chars)", message.length());
        String answer = aiService.chat(message);
        log.debug("AI chat response generated ({} chars)", answer.length());
        return answer;
    }

    /**
     * Cached by article text: summarizing the same article repeatedly
     * (e.g. multiple readers opening the same page) shouldn't re-hit the
     * model every time.
     */
    @PostMapping("/summary")
    @Cacheable(value = "articleSummaries", key = "#request.article.hashCode()")
    public String summarize(@RequestBody SummaryRequest request) {
        log.debug("AI summary requested ({} chars)", request.getArticle() == null ? 0 : request.getArticle().length());
        return aiService.summarize(request.getArticle());
    }
}

