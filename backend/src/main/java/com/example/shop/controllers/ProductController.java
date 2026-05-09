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

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/product")
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductRequest productRequest) {
        ProductDTO response = productService.createProduct(productRequest);
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @GetMapping("/products")
    public ResponseEntity<ProductsResponse> getAllProducts() {
        ProductsResponse response = productService.getAllProducts();
        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/product/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long productId,
            @RequestBody ProductRequest productRequest
    ) {
        ProductDTO response = productService.updateProduct(productId, productRequest);
        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/product/{productId}")
    public ResponseEntity<ProductDTO> deleteProduct(@PathVariable Long productId){
        ProductDTO response = productService.deleteProduct(productId);
        return ResponseEntity.ok().body(response);
    }
}
