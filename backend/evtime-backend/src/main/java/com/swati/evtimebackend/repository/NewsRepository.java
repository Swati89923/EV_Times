package com.swati.evtimebackend.repository;

import com.swati.evtimebackend.entity.News;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NewsRepository
        extends JpaRepository<News, Long>, JpaSpecificationExecutor<News> {

    @Query("""
            SELECT n.category, COUNT(n)
            FROM News n
            GROUP BY n.category
            """)
    List<Object[]> getCategoryStats();

    List<News> findByTitleContainingIgnoreCase(
            String keyword
    );

    List<News> findByCategoryIgnoreCase(
            String category
    );

    List<News> findByCategoryAndTitleContainingIgnoreCase(
            String category,
            String keyword
    );

    boolean existsByTitle(String title);

    boolean existsByTitleIgnoreCase(String title);

    List<News> findTop5ByOrderByViewsDesc();

    // -----------------------------
    // State-wise published news
    // -----------------------------
    Page<News> findByStateIgnoreCaseAndStatusIgnoreCase(
            String state,
            String status,
            Pageable pageable
    );

    // -----------------------------
    // Published News
    // -----------------------------
    Page<News> findByStatusIgnoreCase(
            String status,
            Pageable pageable
    );

    List<News> findByStatusIgnoreCaseOrderByIdDesc(
            String status
    );
    List<News> findTop10ByStatusIgnoreCaseOrderByIdDesc(
            String status
    );
}