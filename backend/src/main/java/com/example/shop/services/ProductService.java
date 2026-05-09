package com.example.shop.services;
import com.example.shop.payloads.dto.ProductDTO;
import com.example.shop.payloads.request.ProductRequest;
import com.example.shop.payloads.response.ProductsResponse;

import java.util.List;

public interface ProductService {
    ProductDTO createProduct(ProductRequest productRequest);

    ProductsResponse getAllProducts();

    ProductDTO updateProduct(Long productId, ProductRequest productRequest);

    ProductDTO deleteProduct(Long productId);
}
