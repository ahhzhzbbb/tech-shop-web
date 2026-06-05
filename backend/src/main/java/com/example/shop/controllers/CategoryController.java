package com.example.shop.controllers;

import com.example.shop.payloads.dto.CategoryDTO;
import com.example.shop.payloads.request.CategoryRequest;
import com.example.shop.payloads.response.CategoryResponse;
import com.example.shop.services.CategoryService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.annotation.security.PermitAll;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "Lấy tất cả danh mục", description = "API dùng để lấy tất cả danh mục sản phẩm. Truyền all=true để lấy cả danh mục đã ẩn (dùng cho admin).")
    @PermitAll
    @GetMapping("/categories")
    public ResponseEntity<CategoryResponse> getAllCategory(
            @RequestParam(name = "all", defaultValue = "false") boolean includeInactive
    ) {
        CategoryResponse response = categoryService.getAllCategory(includeInactive);
        return ResponseEntity.ok().body(response);
    }

//    @Operation(summary = "Lấy danh mục theo ID", description = "API dùng để lấy thông tin một danh mục sản phẩm theo ID")
//    @PermitAll
//    @GetMapping("/category/{id}")
//    public ResponseEntity<Category> getCategoryAndProduct(
//            @PathVariable Long id
//    ) {
//
//        Category response =
//                categoryService.getCategoryAndProduct(id);
//
//        return ResponseEntity.ok().body(response);
//    }

    @Operation(summary = "Tạo danh mục mới", description = "API dùng để tạo một danh mục sản phẩm mới")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/category")
    public ResponseEntity<CategoryDTO> createCategory(
            @RequestBody CategoryRequest request
    ) {

        CategoryDTO response =
                categoryService.createCategory(request);

        return ResponseEntity.ok().body(response);
    }


    @Operation(summary = "Cập nhật danh mục", description = "API dùng để cập nhật thông tin một danh mục sản phẩm")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/category/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryRequest request
    ) {

        CategoryDTO response = categoryService.updateCategory(id, request);

        return ResponseEntity.ok().body(response);
    }


    @Operation(summary = "Xóa danh mục", description = "API dùng để xóa một danh mục sản phẩm")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/category/{id}")
    public ResponseEntity<CategoryDTO> deleteCategory(
            @PathVariable Long id
    ) {

        CategoryDTO response = categoryService.deleteCategory(id);

        return ResponseEntity.ok().body(response);
    }
}
