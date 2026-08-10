package com.swati.evtimebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryStatsDTO {

    private String category;
    private Long count;

}