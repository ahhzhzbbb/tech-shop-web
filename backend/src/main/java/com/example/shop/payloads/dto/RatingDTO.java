package com.example.shop.payloads.dto;

import com.example.shop.models.User;

import java.time.LocalDateTime;

public class RatingDTO {
    private Long id;
    private LocalDateTime createdAt;
    private int score;
    private String comment;
    private User user;
    private ProductDTO product;
}
