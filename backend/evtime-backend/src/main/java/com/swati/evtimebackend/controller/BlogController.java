package com.swati.evtimebackend.controller;

import com.swati.evtimebackend.dto.BlogRequest;
import com.swati.evtimebackend.entity.Blog;
import com.swati.evtimebackend.service.BlogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/blogs")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    public List<Blog> getAllBlogs() {
        return blogService.getAllBlogs();
    }

    @GetMapping("/{id}")
    public Blog getBlog(@PathVariable Long id) {
        return blogService.getBlogById(id);
    }

    @PostMapping
    public Blog addBlog(@RequestBody BlogRequest request) {
        return blogService.addBlog(request);
    }

    @DeleteMapping("/{id}")
    public void deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
    }
}