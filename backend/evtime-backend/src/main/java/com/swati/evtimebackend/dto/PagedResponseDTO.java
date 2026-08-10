package com.swati.evtimebackend.dto;

import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;

/**
 * Plain-POJO pagination envelope. Returning Spring Data's Page<T> directly
 * from a controller works but is discouraged by Spring Data itself (PageImpl
 * has no default constructor, so it doesn't round-trip through Jackson
 * cleanly) and it would have broken Redis cache deserialization for any
 * cached paginated query. This wrapper is a plain class with a no-arg
 * constructor, so it's safe both as an HTTP response body and as a cache
 * value.
 */
public class PagedResponseDTO<T> {

    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean last;

    public PagedResponseDTO() {
    }

    public PagedResponseDTO(List<T> content, int page, int size, long totalElements, int totalPages, boolean last) {
        this.content = content;
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.last = last;
    }

    public static <E, T> PagedResponseDTO<T> from(Page<E> page, Function<E, T> mapper) {
        List<T> mapped = page.getContent().stream().map(mapper).toList();
        return new PagedResponseDTO<>(
                mapped,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    public List<T> getContent() {
        return content;
    }

    public void setContent(List<T> content) {
        this.content = content;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public boolean isLast() {
        return last;
    }

    public void setLast(boolean last) {
        this.last = last;
    }
}
