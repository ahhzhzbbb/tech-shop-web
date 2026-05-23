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
    public ResponseEntity<ProductsResponse> getAllProducts() {
        ProductsResponse response = productService.getAllProducts();
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
    @GetMapping("/products/category/{categoryId}")
    public ResponseEntity<ProductsResponse> getProductsByCategory(@PathVariable Long categoryId) {
        ProductsResponse response = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Tìm kiếm sản phẩm", description = "API dùng để tìm kiếm sản phẩm theo từ khóa")
    @PermitAll
    @GetMapping("/products/search")
    public ResponseEntity<ProductsResponse> searchProducts(@RequestParam String keyword) {
        ProductsResponse response = productService.searchProducts(keyword);
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Cập nhật sản phẩm", description = "API dùng để cập nhật thông tin một sản phẩm")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/product/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long productId,
            @RequestBody ProductRequest productRequest
    ) {
        ProductDTO response = productService.updateProduct(productId, productRequest);
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Xóa sản phẩm", description = "API dùng để xóa một sản phẩm")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/product/{productId}")
    public ResponseEntity<ProductDTO> deleteProduct(@PathVariable Long productId){
        ProductDTO response = productService.deleteProduct(productId);
        return ResponseEntity.ok().body(response);
    }
}
