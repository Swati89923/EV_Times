package com.swati.evtimebackend.service;

import com.swati.evtimebackend.entity.BreakingNews;
import com.swati.evtimebackend.repository.BreakingNewsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BreakingNewsService {

    private final BreakingNewsRepository repository;

    public BreakingNewsService(
            BreakingNewsRepository repository
    ) {
        this.repository = repository;
    }

    public BreakingNews create(
            BreakingNews news
    ) {
        return repository.save(news);
    }

    public List<BreakingNews> getAll() {
        return repository.findAll();
    }

    public List<BreakingNews> getActive() {
        return repository.findByActiveTrue();
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public void toggle(Long id) {

        BreakingNews news =
                repository.findById(id)
                        .orElseThrow();

        news.setActive(
                !news.isActive()
        );

        repository.save(news);
    }
}