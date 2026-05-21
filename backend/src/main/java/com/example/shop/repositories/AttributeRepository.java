package com.example.shop.repositories;

import com.example.shop.models.Attribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttributeRepository extends JpaRepository<Attribute, Long> {
    boolean existsByNameIgnoreCaseAndCategoryId(String name, Long categoryId);

    Optional<Attribute> findByNameIgnoreCaseAndCategoryId(String name, Long categoryId);

    List<Attribute> findByCategoryId(Long categoryId);
}
