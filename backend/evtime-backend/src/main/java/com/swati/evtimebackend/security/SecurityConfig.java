package com.swati.evtimebackend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Central authorization policy for the API.
 *
 * IMPORTANT: the previous configuration set `anyRequest().permitAll()`,
 * which meant every endpoint — including /admin/**, news create/update/
 * delete, and comment deletion — was reachable without a token regardless
 * of the JWT machinery existing elsewhere in the app. This rewrite makes
 * the JWT + role model actually enforce something.
 */
@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final JwtAuthEntryPoint authEntryPoint;
    private final JwtAccessDeniedHandler accessDeniedHandler;

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    public SecurityConfig(
            JwtFilter jwtFilter,
            JwtAuthEntryPoint authEntryPoint,
            JwtAccessDeniedHandler accessDeniedHandler
    ) {
        this.jwtFilter = jwtFilter;
        this.authEntryPoint = authEntryPoint;
        this.accessDeniedHandler = accessDeniedHandler;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Explicit origin allow-list from config instead of "*", since a
        // wildcard origin combined with credentialed requests is both
        // insecure and rejected by browsers anyway.
        config.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(authEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
                )
                .authorizeHttpRequests(auth -> auth
                        // ---- Public read endpoints ----
                        .requestMatchers(HttpMethod.POST, "/signup", "/login").permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/news", "/news/*", "/news/search", "/news/category/**",
                                "/news/filter", "/news/state/**", "/news/popular",
                                "/analytics/category", "/analytics",
                                "/breaking-news", "/breaking-news/active",
                                "/comments/*", "/blogs", "/blogs/*", "/videos", "/videos/*",
                                "/uploads/**", "/api/ai/chat"
                        ).permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/ai/summary").permitAll()
                        .requestMatchers(HttpMethod.POST, "/newsletter/subscribe").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        // ---- Admin-only ----
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/news/update/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/news/delete/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/news/fetch-latest").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/breaking-news/create").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/breaking-news/toggle/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/breaking-news/delete/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/blogs").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/blogs/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/videos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/videos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/videos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/upload").hasRole("ADMIN")

                        // ---- Any authenticated user ----
                        .requestMatchers(HttpMethod.POST, "/news/create").authenticated()
                        .requestMatchers(HttpMethod.POST, "/comments/*").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/comments/*").authenticated()

                        // ---- Everything else requires a valid token ----
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
