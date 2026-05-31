package com.example.shop.repositories;

import com.example.shop.models.PromotionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionItemRepository extends JpaRepository<PromotionItem, Long> {
    Optional<PromotionItem> findByProductId(Long productId);
    List<PromotionItem> findAll();
}
