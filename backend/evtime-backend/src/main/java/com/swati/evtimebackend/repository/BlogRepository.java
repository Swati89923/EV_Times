package com.swati.evtimebackend.repository;

import com.swati.evtimebackend.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogRepository extends JpaRepository<Blog, Long> {

}