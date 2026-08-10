package com.swati.evtimebackend.controller;

import com.swati.evtimebackend.entity.Video;
import com.swati.evtimebackend.service.VideoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/videos")
public class VideoController {

    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @GetMapping
    public List<Video> getAllVideos() {
        return videoService.getAllVideos();
    }

    @GetMapping("/{id}")
    public Video getVideo(@PathVariable Long id) {
        return videoService.getVideoById(id);
    }

    @PostMapping
    public Video addVideo(@RequestBody Video video) {
        return videoService.addVideo(video);
    }

    @PutMapping("/{id}")
    public Video updateVideo(@PathVariable Long id,
                             @RequestBody Video video) {
        return videoService.updateVideo(id, video);
    }

    @DeleteMapping("/{id}")
    public void deleteVideo(@PathVariable Long id) {
        videoService.deleteVideo(id);
    }
}