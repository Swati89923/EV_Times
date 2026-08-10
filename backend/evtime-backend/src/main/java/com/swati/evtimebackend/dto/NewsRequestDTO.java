package com.swati.evtimebackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Input shape for POST /news/create and PUT /news/update/{id}. Binding the
 * raw News entity directly to the request body (as the previous controller
 * did) let callers set fields like `status`, `views`, or `id` directly in
 * the payload; this DTO only exposes what a caller should actually be able
 * to set.
 */
public class NewsRequestDTO {

    @NotBlank(message = "Title is required")
    @Size(max = 500, message = "Title must be under 500 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String imageUrl;

    @NotBlank(message = "Category is required")
    private String category;

    private String author;
    private String source;
    private String url;
    private String publishedAt;
    private String state;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(String publishedAt) {
        this.publishedAt = publishedAt;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}
