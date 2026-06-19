package com.example.shop.services.impls;

import com.example.shop.models.Product;
import com.example.shop.models.Rating;
import com.example.shop.models.User;
import com.example.shop.payloads.request.RatingRequest;
import com.example.shop.payloads.response.RatingResponse;
import com.example.shop.repositories.ProductRepository;
import com.example.shop.repositories.RatingRepository;
import com.example.shop.repositories.UserRepository;
import com.example.shop.services.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {
    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    @CacheEvict(value = {"ratings", "products", "product"}, allEntries = true)
    public RatingResponse createRating(RatingRequest ratingRequest, String email) {
        User user = userRepository.findByEmail(email).or(() -> userRepository.findByUsername(email)).orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(ratingRequest.getProductId()).orElseThrow(() -> new RuntimeException("Product not found"));

        Rating rating = Rating.builder()
                .score(ratingRequest.getScore())
                .comment(ratingRequest.getComment())
                .user(user)
                .product(product)
                .build();

        rating = ratingRepository.save(rating);
        recalculateAverageScore(product);

        return toRatingResponse(rating);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"ratings", "products", "product"}, allEntries = true)
    public RatingResponse updateRating(Long ratingId, RatingRequest ratingRequest, String email) {
        User user = userRepository.findByEmail(email).or(() -> userRepository.findByUsername(email)).orElseThrow(() -> new RuntimeException("User not found"));

        Rating rating = ratingRepository.findById(ratingId).orElseThrow(() -> new RuntimeException("Rating not found"));

        if (!rating.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("You are not authorized to update this rating");
        }

        if (!rating.getProduct().getId().equals(ratingRequest.getProductId())) {
            throw new RuntimeException("Product ID does not match the rating's product");
        }

        rating.setScore(ratingRequest.getScore());
        rating.setComment(ratingRequest.getComment());
        rating = ratingRepository.save(rating);
        recalculateAverageScore(rating.getProduct());

        return toRatingResponse(rating);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"ratings", "products", "product"}, allEntries = true)
    public void deleteRating(Long ratingId, String email) {
        User user = userRepository.findByEmail(email).or(() -> userRepository.findByUsername(email)).orElseThrow(() -> new RuntimeException("User not found"));

        Rating rating = ratingRepository.findById(ratingId).orElseThrow(() -> new RuntimeException("Rating not found"));

        if (!rating.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("You are not authorized to delete this rating");
        }

        Product product = rating.getProduct();
        ratingRepository.delete(rating);
        recalculateAverageScore(product);
    }

    @Override
    @Cacheable(value = "ratings", key = "#productId")
    public List<RatingResponse> getRatingsByProductId(Long productId) {
        List<Rating> ratings = ratingRepository.findByProductId(productId);
        return ratings.stream().map(this::toRatingResponse).collect(Collectors.toList());
    }

    private void recalculateAverageScore(Product product) {
        Double avg = ratingRepository.findAverageScoreByProductId(product.getId());
        product.setAverageScore(avg != null ? avg : 0.0);
        productRepository.save(product);
    }

    private RatingResponse toRatingResponse(Rating rating) {
        User user = rating.getUser();
        return RatingResponse.builder()
                .id(rating.getId())
                .createdAt(rating.getCreatedAt())
                .score(rating.getScore())
                .comment(rating.getComment())
                .userId(user.getUserId())
                .userFullName(user.getFullName() != null ? user.getFullName() : user.getUsername())
                .productId(rating.getProduct().getId())
                .build();
    }
}
