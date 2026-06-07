package com.example.shop.services;

import com.example.shop.payloads.dto.ProductDTO;
import com.example.shop.payloads.request.ProductRequest;
import com.example.shop.payloads.response.ProductsResponse;

public interface ProductService {
    ProductDTO createProduct(ProductRequest productRequest);

    ProductsResponse getAllProducts(int page, int size);

    ProductDTO getProductById(Long productId);

    ProductsResponse getProductsByCategory(Long categoryId, int page, int size);

    ProductsResponse getProductsByCategory(String categoryName, int page, int size);

    ProductsResponse searchProducts(String keyword, int page, int size);

    ProductsResponse filterProducts(
            Long categoryId,
            String categoryName,
            Long minPrice,
            Long maxPrice,
            String attributesCsv,
            String sortBy,
            String sortDir,
            int page,
            int size);

    ProductDTO updateProduct(Long productId, ProductRequest productRequest);

    ProductDTO deleteProduct(Long productId);

    ProductDTO addProductToCategory(Long productId, Long categoryId);

    ProductDTO removeProductFromCategory(Long productId, Long categoryId);
}
