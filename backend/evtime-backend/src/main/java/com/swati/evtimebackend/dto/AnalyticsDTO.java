package com.swati.evtimebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnalyticsDTO {

    private long totalNews;
    private long totalUsers;
    private long totalComments;
}