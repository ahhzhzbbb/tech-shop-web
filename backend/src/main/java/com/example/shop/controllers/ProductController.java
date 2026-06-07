package com.example.shop.controllers;

import com.example.shop.payloads.dto.ProductDTO;
import com.example.shop.payloads.request.ProductRequest;
import com.example.shop.payloads.response.ProductsResponse;
import com.example.shop.services.ProductService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @Operation(summary = "Tạo sản phẩm mới", description = "API dùng để tạo một sản phẩm mới")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/product")
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductRequest productRequest) {
        ProductDTO response = productService.createProduct(productRequest);
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Lấy tất cả sản phẩm", description = "API dùng để lấy tất cả sản phẩm")
    @PermitAll
    @GetMapping("/products")
    public ResponseEntity<ProductsResponse> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size) {
        ProductsResponse response = productService.getAllProducts(page, size);
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Lấy sản phẩm theo ID", description = "API dùng để lấy thông tin một sản phẩm theo ID")
    @PermitAll
    @GetMapping("/product/{productId}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long productId) {
        ProductDTO response = productService.getProductById(productId);
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Lấy sản phẩm theo danh mục", description = "API dùng để lấy tất cả sản phẩm của một danh mục")
    @PermitAll
    @GetMapping("/products/category/id/{categoryId}")
    public ResponseEntity<ProductsResponse> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ProductsResponse response = productService.getProductsByCategory(categoryId, page, size);
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Lấy sản phẩm theo tên danh mục", description = "API dùng để lấy tất cả sản phẩm của một danh mục theo tên")
    @PermitAll
    @GetMapping("/products/category/{categoryName}")
    public ResponseEntity<ProductsResponse> getProductsByCategory(
            @PathVariable String categoryName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ProductsResponse response = productService.getProductsByCategory(categoryName, page, size);
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Tìm kiếm sản phẩm", description = "API dùng để tìm kiếm sản phẩm theo từ khóa")
    @PermitAll
    @GetMapping("/products/search")
    public ResponseEntity<ProductsResponse> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ProductsResponse response = productService.searchProducts(keyword, page, size);
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Lọc sản phẩm", description = "API dùng để lọc sản phẩm theo nhiều tiêu chí (giá, danh mục, thuộc tính)")
    @PermitAll
    @GetMapping("/products/filter")
    public ResponseEntity<ProductsResponse> filterProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String categoryName,
            @RequestParam(required = false) Long minPrice,
            @RequestParam(required = false) Long maxPrice,
            @RequestParam(required = false) String attributes, // format: "attrId:value,attrId2:value2"
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ProductsResponse response = productService.filterProducts(categoryId, categoryName, minPrice, maxPrice,
                attributes, sortBy, sortDir, page, size);
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Cập nhật sản phẩm", description = "API dùng để cập nhật thông tin một sản phẩm")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/product/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long productId,
            @RequestBody ProductRequest productRequest) {
        ProductDTO response = productService.updateProduct(productId, productRequest);
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Xóa sản phẩm", description = "API dùng để xóa một sản phẩm")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/product/{productId}")
    public ResponseEntity<ProductDTO> deleteProduct(@PathVariable Long productId) {
        ProductDTO response = productService.deleteProduct(productId);
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Thêm sản phẩm vào danh mục", description = "API dùng để thêm một sản phẩm vào một danh mục")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/product/{productId}/categories/{categoryId}")
    public ResponseEntity<ProductDTO> addProductToCategory(
            @PathVariable Long productId,
            @PathVariable Long categoryId) {
        ProductDTO response = productService.addProductToCategory(productId, categoryId);
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Xóa sản phẩm ra khỏi danh mục", description = "API dùng để xóa một sản phẩm ra khỏi một danh mục")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/product/{productId}/categories/{categoryId}")
    public ResponseEntity<ProductDTO> removeProductFromCategory(
            @PathVariable Long productId,
            @PathVariable Long categoryId) {
        ProductDTO response = productService.removeProductFromCategory(productId, categoryId);
        return ResponseEntity.ok().body(response);
    }
}
