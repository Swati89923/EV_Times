package com.swati.evtimebackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    @Column(length = 1000)
    private String message;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "news_id")
    private News news;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}