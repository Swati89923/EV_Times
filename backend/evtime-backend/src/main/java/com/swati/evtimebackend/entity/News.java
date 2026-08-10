package com.swati.evtimebackend.entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class News implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Column(length = 500)
    private String title;

    @NotBlank(message = "Description is required")
    @Column(columnDefinition = "TEXT")
    private String description;


    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @NotBlank(message = "Category is required")
    private String category;

   
    @Column(nullable = false)
    private Long views = 0L;
    private String author;

    private String source;

    @Column(columnDefinition = "TEXT")
    private String url;

    private String publishedAt;
    private String state;

    @Column(nullable = false)
    private String status = "PENDING";

  
}