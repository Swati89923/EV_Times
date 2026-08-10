package com.swati.evtimebackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS is now configured once, centrally, in SecurityConfig's
 * CorsConfigurationSource bean. Having CORS rules duplicated across
 * WebConfig, a separate CorsConfig, and inline in SecurityConfig (as this
 * project previously did) meant three sources of truth that could silently
 * disagree; this class now only wires the uploaded-file resource handler.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
