package com.swati.evtimebackend.service;

import com.swati.evtimebackend.dto.BlogRequest;
import com.swati.evtimebackend.entity.Blog;
import com.swati.evtimebackend.repository.BlogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BlogService {

    private final BlogRepository blogRepository;

    public BlogService(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    // Get All Blogs
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    // Get Blog By Id
    public Blog getBlogById(Long id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found"));
    }

    // Add Blog
    public Blog addBlog(BlogRequest request) {

        Blog blog = Blog.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .content(request.getContent())
                .category(request.getImageUrl())
                .author(request.getAuthor())
                .category(request.getCategory())
                .readingTime(request.getReadingTime())
                .createdAt(LocalDateTime.now())
                .build();

        return blogRepository.save(blog);
    }

    // Delete Blog
    public void deleteBlog(Long id) {
        blogRepository.deleteById(id);
    }
}