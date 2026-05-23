package com.example.shop.controllers;

import com.example.shop.models.Category;
import com.example.shop.services.CategoryService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.annotation.security.PermitAll;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "Lấy tất cả danh mục", description = "API dùng để lấy tất cả danh mục sản phẩm")
    @PermitAll
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategory() {

        List<Category> response =
                categoryService.getAllCategory();

        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Lấy danh mục theo ID", description = "API dùng để lấy thông tin một danh mục sản phẩm theo ID")
    @PermitAll
    @GetMapping("/category/{id}")
    public ResponseEntity<Category> getCategoryAndProduct(
            @PathVariable Long id
    ) {

        Category response =
                categoryService.getCategoryAndProduct(id);

        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Tạo danh mục mới", description = "API dùng để tạo một danh mục sản phẩm mới")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/category")
    public ResponseEntity<Category> createCategory(
            @RequestBody Category category
    ) {

        Category response =
                categoryService.createCategory(category);

        return ResponseEntity.ok().body(response);
    }


    @Operation(summary = "Cập nhật danh mục", description = "API dùng để cập nhật thông tin một danh mục sản phẩm")
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


    @Operation(summary = "Xóa danh mục", description = "API dùng để xóa một danh mục sản phẩm")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/category/{id}")
    public ResponseEntity<String> deleteCategory(
            @PathVariable Long id
    ) {

        categoryService.deleteCategory(id);

        return ResponseEntity.ok("Delete category successfully");
    }
}
