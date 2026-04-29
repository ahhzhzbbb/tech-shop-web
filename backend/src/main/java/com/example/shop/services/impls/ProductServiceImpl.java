package com.example.shop.services.impls;

import com.example.shop.exceptions.ResourceNotFoundException;
import com.example.shop.models.Product;
import com.example.shop.payloads.dto.ProductDTO;
import com.example.shop.payloads.request.ProductRequest;
import com.example.shop.payloads.response.ProductsResponse;
import com.example.shop.repositories.ProductRepository;
import com.example.shop.services.ProductService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ModelMapper modelMapper;

    private final ProductRepository productRepository;


    @Override
    public ProductDTO createProduct(ProductRequest productRequest) {
        Product newProduct = new Product();
        modelMapper.map(productRequest, newProduct);

        productRepository.save(newProduct);
        return modelMapper.map(productRequest, ProductDTO.class);
    }

    @Override
    public ProductsResponse getAllProducts() {
        List<Product> products = productRepository.findAll();
        List<ProductDTO> productList = products.stream()
                .map(product -> new ProductDTO(product.getName(), product.getDescription(), product.getPrice(),
                        product.getQuantity(), product.getImageUrl(), product.getStatus(), product.getAverageScore()))
                .toList();
        ProductsResponse response = new ProductsResponse();
        response.setProducts(productList);
        return response;
    }

    @Transactional
    @Override
    public ProductDTO updateProduct(Long productId, ProductRequest productRequest) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        if (productRequest.getName() != null) {
            product.setName(productRequest.getName());
        }

        if (productRequest.getDescription() != null) {
            product.setDescription(productRequest.getDescription());
        }

        if (productRequest.getPrice() != null) {
            product.setPrice(productRequest.getPrice());
        }

        if (productRequest.getQuantity() != null) {
            product.setQuantity(productRequest.getQuantity());
        }

        if (productRequest.getImageUrl() != null) {
            product.setImageUrl(productRequest.getImageUrl());
        }

        if (productRequest.getStatus() != null) {
            product.setStatus(productRequest.getStatus());
        }

        productRepository.save(product);
        return modelMapper.map(product, ProductDTO.class);
    }

    @Override
    public ProductDTO deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        productRepository.delete(product);

        return modelMapper.map(product, ProductDTO.class);
    }
}
