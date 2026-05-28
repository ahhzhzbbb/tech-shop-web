package com.example.shop.services.impls;

import com.example.shop.exceptions.ResourceNotFoundException;
import com.example.shop.models.Attribute;
import com.example.shop.models.Category;
import com.example.shop.models.Product;
import com.example.shop.models.ProductAttributeValue;
import com.example.shop.payloads.dto.ProductAttributeValueDTO;
import com.example.shop.payloads.dto.ProductDTO;
import com.example.shop.payloads.request.ProductAttributeValueRequest;
import com.example.shop.payloads.request.ProductRequest;
import com.example.shop.payloads.response.ProductsResponse;
import com.example.shop.repositories.AttributeRepository;
import com.example.shop.repositories.CategoryRepository;
import com.example.shop.repositories.ProductRepository;
import com.example.shop.services.ProductService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AttributeRepository attributeRepository;


    @Transactional
    @Override
    public ProductDTO createProduct(ProductRequest productRequest) {
        Product newProduct = new Product();
        newProduct.setName(productRequest.getName());
        newProduct.setDescription(productRequest.getDescription());
        newProduct.setPrice(productRequest.getPrice());
        newProduct.setQuantity(productRequest.getQuantity());
        newProduct.setImageUrl(productRequest.getImageUrl());
        newProduct.setStatus(productRequest.getStatus());
        newProduct.setAverageScore(productRequest.getAverageScore());
        newProduct.setCategory(getActiveCategory(productRequest.getCategoryId()));

        replaceAttributeValues(newProduct, productRequest.getAttributes());

        Product savedProduct = productRepository.save(newProduct);
        return convertToDTO(savedProduct);
    }

    @Transactional
    @Override
    public ProductsResponse getAllProducts() {
        List<Product> products = productRepository.findAll();
        List<ProductDTO> productList = products.stream()
                .map(this::convertToDTO)
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

        if (productRequest.getAverageScore() != null) {
            product.setAverageScore(productRequest.getAverageScore());
        }

        if (productRequest.getCategoryId() != null) {
            Category category = getActiveCategory(productRequest.getCategoryId());
            product.setCategory(category);
            product.getAttributeValues().removeIf(value ->
                    !value.getAttribute().getCategory().getId().equals(category.getId()));
        }

        if (productRequest.getAttributes() != null) {
            replaceAttributeValues(product, productRequest.getAttributes());
        }

        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    @Transactional
    @Override
    public ProductDTO deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        ProductDTO deletedProduct = convertToDTO(product);
        productRepository.delete(product);

        return deletedProduct;
    }

    @Transactional
    @Override
    public ProductDTO getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        return convertToDTO(product);
    }

    @Transactional
    @Override
    public ProductsResponse getProductsByCategory(Long categoryId) {
        getActiveCategory(categoryId);
        List<Product> products = productRepository.findByCategoryId(categoryId);
        List<ProductDTO> productList = products.stream()
                .map(this::convertToDTO)
                .toList();
        ProductsResponse response = new ProductsResponse();
        response.setProducts(productList);
        return response;
    }

    @Transactional
    @Override
    public ProductsResponse getProductsByCategory(String categoryName) {
        Category category = categoryRepository.findByNameIgnoreCase(categoryName)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "name", categoryName));
        List<Product> products = productRepository.findByCategoryId(category.getId());
        List<ProductDTO> productList = products.stream()
                .map(this::convertToDTO)
                .toList();
        ProductsResponse response = new ProductsResponse();
        response.setProducts(productList);
        return response;
    }

    @Transactional
    @Override
    public ProductsResponse searchProducts(String keyword) {
        List<Product> products = productRepository.findByNameContainingIgnoreCase(keyword);
        List<ProductDTO> productList = products.stream()
                .map(this::convertToDTO)
                .toList();
        ProductsResponse response = new ProductsResponse();
        response.setProducts(productList);
        return response;
    }

    private Category getActiveCategory(Long categoryId) {
        if (categoryId == null) {
            throw new RuntimeException("categoryId không được để trống");
        }

        return categoryRepository.findById(categoryId)
                .filter(Category::getActive)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
    }

    private Attribute getAttribute(Long attributeId) {
        if (attributeId == null) {
            throw new RuntimeException("attributeId không được để trống");
        }

        return attributeRepository.findById(attributeId)
                .orElseThrow(() -> new ResourceNotFoundException("Attribute", "id", attributeId));
    }

    private void replaceAttributeValues(
            Product product,
            List<ProductAttributeValueRequest> attributeRequests
    ) {
        if (attributeRequests == null) {
            return;
        }

        Set<Long> requestedAttributeIds = new HashSet<>();
        for (ProductAttributeValueRequest attributeRequest : attributeRequests) {
            Attribute attribute = getAttribute(attributeRequest.getAttributeId());
            validateAttributeBelongsToProductCategory(product, attribute);

            if (!requestedAttributeIds.add(attribute.getId())) {
                throw new RuntimeException("Danh sách thuộc tính sản phẩm bị trùng");
            }

            ProductAttributeValue existingValue = product.getAttributeValues()
                    .stream()
                    .filter(value -> value.getAttribute().getId().equals(attribute.getId()))
                    .findFirst()
                    .orElse(null);

            if (existingValue == null) {
                existingValue = new ProductAttributeValue();
                existingValue.setProduct(product);
                existingValue.setAttribute(attribute);
                product.getAttributeValues().add(existingValue);
            }

            existingValue.setValue(normalizeAttributeValue(attributeRequest.getValue()));
        }

        product.getAttributeValues().removeIf(value ->
                !requestedAttributeIds.contains(value.getAttribute().getId()));
    }

    private void validateAttributeBelongsToProductCategory(Product product, Attribute attribute) {
        if (!product.getCategory().getId().equals(attribute.getCategory().getId())) {
            throw new RuntimeException("Thuộc tính không thuộc danh mục của sản phẩm");
        }
    }

    private String normalizeAttributeValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new RuntimeException("Giá trị thuộc tính không được để trống");
        }

        return value.trim();
    }

    private ProductDTO convertToDTO(Product product) {
        List<ProductAttributeValueDTO> attributes = product.getAttributeValues()
                .stream()
                .map(value -> new ProductAttributeValueDTO(
                        value.getId(),
                        value.getAttribute().getId(),
                        value.getAttribute().getName(),
                        value.getValue()
                ))
                .toList();

        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getQuantity(),
                product.getImageUrl(),
                product.getStatus(),
                product.getAverageScore(),
                product.getCategory().getId(),
                product.getCategory().getName(),
                attributes
        );
    }
}
