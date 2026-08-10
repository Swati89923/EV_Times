package com.swati.evtimebackend.specification;

import com.swati.evtimebackend.entity.News;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public final class NewsSpecification {

    private NewsSpecification() {
    }

    public static Specification<News> withStatus(String status) {
        return (root, query, cb) ->
                status == null ? null : cb.equal(cb.lower(root.get("status")), status.toLowerCase());
    }

    public static Specification<News> withCategory(String category) {
        return (root, query, cb) ->
                (category == null || category.isBlank() || category.equalsIgnoreCase("all"))
                        ? null
                        : cb.equal(cb.lower(root.get("category")), category.toLowerCase());
    }

    public static Specification<News> withState(String state) {
        return (root, query, cb) ->
                (state == null || state.isBlank() || state.equalsIgnoreCase("all states"))
                        ? null
                        : cb.equal(cb.lower(root.get("state")), state.toLowerCase());
    }

    public static Specification<News> withSource(String source) {
        return (root, query, cb) ->
                (source == null || source.isBlank() || source.equalsIgnoreCase("all"))
                        ? null
                        : cb.equal(cb.lower(root.get("source")), source.toLowerCase());
    }

    public static Specification<News> withKeyword(String keyword) {
        return (root, query, cb) ->
                (keyword == null || keyword.isBlank())
                        ? null
                        : cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%");
    }

    /** publishedAt is stored as a free-text string from the source API, so this is a best-effort prefix match. */
    public static Specification<News> publishedAfter(LocalDate date) {
        return (root, query, cb) ->
                date == null ? null : cb.greaterThanOrEqualTo(root.get("publishedAt"), date.toString());
    }
}
