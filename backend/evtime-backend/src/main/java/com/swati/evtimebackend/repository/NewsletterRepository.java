package com.swati.evtimebackend.repository;

import com.swati.evtimebackend.entity.Newsletter;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsletterRepository
        extends JpaRepository<Newsletter, Long> {

    boolean existsByEmail(String email);

}