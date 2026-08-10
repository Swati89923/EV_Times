package com.swati.evtimebackend.dto;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class BlogRequest {
    private String title;
    private String description;
    private String content;
    private String imageUrl;
    private String author;
    private String category;
    private String readingTime;
}
