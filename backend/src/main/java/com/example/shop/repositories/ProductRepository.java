package com.example.shop.repositories;

import com.example.shop.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
  Optional<Product> findByName(String name);

  List<Product> findByNameContainingIgnoreCase(String name);

  Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

  List<Product> findByCategoryId(Long categoryId);

  Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
}
