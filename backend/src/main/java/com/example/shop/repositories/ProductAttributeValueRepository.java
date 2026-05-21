package com.example.shop.repositories;

import com.example.shop.models.ProductAttributeValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductAttributeValueRepository extends JpaRepository<ProductAttributeValue, Long> {
    List<ProductAttributeValue> findByProductId(Long productId);

    Optional<ProductAttributeValue> findByProductIdAndAttributeId(Long productId, Long attributeId);

    void deleteByProductIdAndAttributeId(Long productId, Long attributeId);
}
