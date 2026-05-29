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
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {
    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
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

        return RatingResponse.builder()
                .id(rating.getId())
                .createdAt(rating.getCreatedAt())
                .score(rating.getScore())
                .comment(rating.getComment())
                .userId(user.getUserId())
                .userFullName(user.getFullName() != null ? user.getFullName() : user.getUsername())
                .productId(product.getId())
                .build();
    }

    @Override
    public List<RatingResponse> getRatingsByProductId(Long productId) {
        List<Rating> ratings = ratingRepository.findByProductId(productId);
        return ratings.stream().map(rating -> RatingResponse.builder()
                .id(rating.getId())
                .createdAt(rating.getCreatedAt())
                .score(rating.getScore())
                .comment(rating.getComment())
                .userId(rating.getUser().getUserId())
                .userFullName(rating.getUser().getFullName() != null ? rating.getUser().getFullName() : rating.getUser().getUsername())
                .productId(rating.getProduct().getId())
                .build()).collect(Collectors.toList());
    }
}
