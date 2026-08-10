package com.swati.evtimebackend.repository;

import com.swati.evtimebackend.entity.BreakingNews;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BreakingNewsRepository
        extends JpaRepository<BreakingNews, Long> {

    List<BreakingNews> findByActiveTrue();
}