package com.swati.evtimebackend.mapper;

import com.swati.evtimebackend.dto.NewsRequestDTO;
import com.swati.evtimebackend.dto.NewsResponseDTO;
import com.swati.evtimebackend.entity.News;

public final class NewsMapper {

    private NewsMapper() {
    }

    public static NewsResponseDTO toResponse(News news) {
        if (news == null) return null;
        return new NewsResponseDTO(
                news.getId(),
                news.getTitle(),
                news.getDescription(),
                news.getImageUrl(),
                news.getCategory(),
                news.getViews(),
                news.getAuthor(),
                news.getSource(),
                news.getUrl(),
                news.getPublishedAt(),
                news.getState(),
                news.getStatus()
        );
    }

    public static News toEntity(NewsRequestDTO dto) {
        News news = new News();
        applyToEntity(dto, news);
        return news;
    }

    /** Copies editable fields from the DTO onto an existing entity (used for updates). */
    public static void applyToEntity(NewsRequestDTO dto, News news) {
        news.setTitle(dto.getTitle());
        news.setDescription(dto.getDescription());
        news.setImageUrl(dto.getImageUrl());
        news.setCategory(dto.getCategory());
        news.setAuthor(dto.getAuthor());
        news.setSource(dto.getSource());
        news.setUrl(dto.getUrl());
        news.setPublishedAt(dto.getPublishedAt());
        news.setState(dto.getState());
    }
}
