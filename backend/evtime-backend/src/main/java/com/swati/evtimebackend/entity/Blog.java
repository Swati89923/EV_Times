package com.swati.evtimebackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "blogs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Blog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String title;

    @Column(length = 1000)
    private String description;

    @Column(length = 10000)
    private String content;

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    private String author;

    private String category;

    @Column(name = "reading_time")
    private String readingTime;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private String sourceUrl;
}