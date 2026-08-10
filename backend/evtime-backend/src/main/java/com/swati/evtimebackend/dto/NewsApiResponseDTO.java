package com.swati.evtimebackend.dto;

import lombok.Data;
import java.util.List;

@Data
public class NewsApiResponseDTO {

    private String status;

    private List<NewsApiArticleDTO> articles;
}