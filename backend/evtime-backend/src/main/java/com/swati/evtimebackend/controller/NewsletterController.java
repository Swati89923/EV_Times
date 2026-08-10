package com.swati.evtimebackend.controller;

import com.swati.evtimebackend.entity.Newsletter;
import com.swati.evtimebackend.repository.NewsletterRepository;
import org.springframework.web.bind.annotation.*;

@RestController
public class NewsletterController {

    private final NewsletterRepository repository;

    public NewsletterController(
            NewsletterRepository repository
    ) {
        this.repository = repository;
    }

    @PostMapping("/newsletter/subscribe")
    public String subscribe(
            @RequestBody Newsletter newsletter
    ) {

        if (
                repository.existsByEmail(
                        newsletter.getEmail()
                )
        ) {
            return "Already subscribed";
        }

        repository.save(newsletter);

        return "Subscribed successfully";
    }
}