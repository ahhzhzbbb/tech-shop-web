package com.example.shop.payloads.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class RatingResponse {
    private Long id;
    private LocalDateTime createdAt;
    private int score;
    private String comment;
    private Long userId;
    private String userFullName;
    private Long productId;
}
