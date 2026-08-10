package com.swati.evtimebackend.repository;

import com.swati.evtimebackend.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VideoRepository extends JpaRepository<Video, Long> {

}