package com.example.shop.repositories;

import com.example.shop.models.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByProductId(Long productId);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.product.id = :productId")
    Double findAverageScoreByProductId(@Param("productId") Long productId);

    Optional<Rating> findByIdAndUserUserId(Long id, Long userId);
}
