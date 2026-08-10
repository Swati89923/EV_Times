package com.swati.evtimebackend.dto;

import lombok.Data;

@Data
public class NewsApiArticleDTO {

    private String title;

    private String description;

    private String urlToImage;

    private String author;

    // NEW
    private String url;

    private String publishedAt;

    private SourceDTO source;
}