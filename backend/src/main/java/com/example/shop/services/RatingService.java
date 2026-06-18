package com.example.shop.services;

import com.example.shop.payloads.request.RatingRequest;
import com.example.shop.payloads.response.RatingResponse;

import java.util.List;

public interface RatingService {
    RatingResponse createRating(RatingRequest ratingRequest, String email);

    RatingResponse updateRating(Long ratingId, RatingRequest ratingRequest, String email);

    void deleteRating(Long ratingId, String email);

    List<RatingResponse> getRatingsByProductId(Long productId);
}
