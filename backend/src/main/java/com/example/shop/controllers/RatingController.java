package com.example.shop.controllers;

import com.example.shop.payloads.request.RatingRequest;
import com.example.shop.payloads.response.RatingResponse;
import com.example.shop.services.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RatingController {
    private final RatingService ratingService;

    @PostMapping("/ratings")
    public ResponseEntity<RatingResponse> createRating(@Valid @RequestBody RatingRequest ratingRequest, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ratingService.createRating(ratingRequest, userDetails.getUsername()));
    }

    @PutMapping("/ratings/{id}")
    public ResponseEntity<RatingResponse> updateRating(@PathVariable Long id, @Valid @RequestBody RatingRequest ratingRequest, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ratingService.updateRating(id, ratingRequest, userDetails.getUsername()));
    }

    @DeleteMapping("/ratings/{id}")
    public ResponseEntity<Void> deleteRating(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        ratingService.deleteRating(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/products/{productId}/ratings")
    public ResponseEntity<List<RatingResponse>> getRatingsByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(ratingService.getRatingsByProductId(productId));
    }
}
