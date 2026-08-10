package com.swati.evtimebackend.service;

import com.swati.evtimebackend.entity.Video;
import com.swati.evtimebackend.repository.VideoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VideoService {

    private final VideoRepository videoRepository;

    public VideoService(VideoRepository videoRepository) {
        this.videoRepository = videoRepository;
    }

    // Get All Videos
    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    // Get Video By Id
    public Video getVideoById(Long id) {
        return videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));
    }

    // Add Video
    public Video addVideo(Video video) {
        video.setCreatedAt(LocalDateTime.now());

        if (video.getViews() == null) {
            video.setViews(0L);
        }

        return videoRepository.save(video);
    }

    // Update Video
    public Video updateVideo(Long id, Video updatedVideo) {

        Video video = getVideoById(id);

        video.setTitle(updatedVideo.getTitle());
        video.setDescription(updatedVideo.getDescription());
        video.setThumbnailUrl(updatedVideo.getThumbnailUrl());
        video.setYoutubeUrl(updatedVideo.getYoutubeUrl());
        video.setCategory(updatedVideo.getCategory());
        video.setDuration(updatedVideo.getDuration());

        return videoRepository.save(video);
    }

    // Delete Video
    public void deleteVideo(Long id) {
        videoRepository.deleteById(id);
    }
}