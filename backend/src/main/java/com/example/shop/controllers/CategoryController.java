package com.example.shop.controllers;

import com.example.shop.models.Category;
import com.example.shop.services.CategoryService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.security.PermitAll;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PermitAll
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategory() {

        List<Category> response =
                categoryService.getAllCategory();

        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @GetMapping("/category/{id}")
    public ResponseEntity<Category> getCategoryAndProduct(
            @PathVariable Long id
    ) {

        Category response =
                categoryService.getCategoryAndProduct(id);

        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/category")
    public ResponseEntity<Category> createCategory(
            @RequestBody Category category
    ) {

        Category response =
                categoryService.createCategory(category);

        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/category/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id,
            @RequestBody Category category
    ) {

        Category response =
                categoryService.updateCategory(id, category);

        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/category/{id}")
    public ResponseEntity<String> deleteCategory(
            @PathVariable Long id
    ) {

        categoryService.deleteCategory(id);

        return ResponseEntity.ok("Delete category successfully");
    }
}
