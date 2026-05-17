package com.example.shop.repositories;

import com.example.shop.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
  Optional<Product> findByName(String name);

  List<Product> findByNameContainingIgnoreCase(String name);

  List<Product> findByCategoryId(Long categoryId);
}
