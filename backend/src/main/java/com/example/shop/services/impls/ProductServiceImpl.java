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
import com.example.shop.payloads.response.PaginationInfo;
import com.example.shop.payloads.response.ProductsResponse;
import com.example.shop.repositories.AttributeRepository;
import com.example.shop.repositories.CategoryRepository;
import com.example.shop.repositories.ProductRepository;
import com.example.shop.services.ProductService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
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

        replaceAttributeValues(newProduct, productRequest.getAttributeValues());

        Product savedProduct = productRepository.save(newProduct);
        return convertToDTO(savedProduct);
    }

    @Transactional
    @Override
    public ProductsResponse getAllProducts(int page, int size) {
        Page<Product> products = productRepository.findAll(createPageable(page, size));
        return toProductsResponse(products);
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
            product.getAttributeValues()
                    .removeIf(value -> !value.getAttribute().getCategory().getId().equals(category.getId()));
        }

        if (productRequest.getAttributeValues() != null) {
            replaceAttributeValues(product, productRequest.getAttributeValues());
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
    public ProductsResponse getProductsByCategory(Long categoryId, int page, int size) {
        getActiveCategory(categoryId);
        Page<Product> products = productRepository.findByCategoryId(categoryId, createPageable(page, size));
        return toProductsResponse(products);
    }

    @Transactional
    @Override
    public ProductsResponse getProductsByCategory(String categoryName, int page, int size) {
        Category category = categoryRepository.findByNameIgnoreCase(categoryName)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "name", categoryName));
        Page<Product> products = productRepository.findByCategoryId(category.getId(), createPageable(page, size));
        return toProductsResponse(products);
    }

    @Transactional
    @Override
    public ProductsResponse searchProducts(String keyword, int page, int size) {
        Page<Product> products = productRepository.findByNameContainingIgnoreCase(keyword, createPageable(page, size));
        return toProductsResponse(products);
    }

    @Transactional
    @Override
    public ProductsResponse filterProducts(Long categoryId, String categoryName, Long minPrice, Long maxPrice,
            String attributesCsv, String sortBy, String sortDir, int page, int size) {
        Long resolvedCategoryId;
        if (categoryName != null && (categoryId == null)) {
            Category category = categoryRepository.findByNameIgnoreCase(categoryName)
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "name", categoryName));
            resolvedCategoryId = category.getId();
        } else {
            resolvedCategoryId = categoryId;
        }

        Specification<Product> spec = (root, query, cb) -> {
            query.distinct(true);
            Predicate predicate = cb.conjunction();

            if (resolvedCategoryId != null) {
                predicate = cb.and(predicate, cb.equal(root.get("category").get("id"), resolvedCategoryId));
            }

            if (minPrice != null) {
                predicate = cb.and(predicate, cb.ge(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicate = cb.and(predicate, cb.le(root.get("price"), maxPrice));
            }

            if (attributesCsv != null && !attributesCsv.trim().isEmpty()) {
                String[] pairs = attributesCsv.split(",");
                for (String pair : pairs) {
                    String[] kv = pair.split(":", 2);
                    if (kv.length != 2)
                        continue;
                    Long attrId;
                    try {
                        attrId = Long.parseLong(kv[0]);
                    } catch (NumberFormatException e) {
                        continue;
                    }
                    String val = kv[1];

                    Join<Product, ProductAttributeValue> join = root.join("attributeValues", JoinType.INNER);
                    predicate = cb.and(predicate,
                            cb.and(
                                    cb.equal(join.get("attribute").get("id"), attrId),
                                    cb.equal(join.get("value"), val)));
                }
            }

            return predicate;
        };

        Page<Product> products = productRepository.findAll(spec, createPageable(sortBy, sortDir, page, size));
        return toProductsResponse(products);
    }

    private Pageable createPageable(String sortBy, String sortDir, int page, int size) {
        if (page < 0) {
            throw new RuntimeException("page phải lớn hơn hoặc bằng 0");
        }

        if (size <= 0) {
            throw new RuntimeException("size phải lớn hơn 0");
        }

        String normalized = (sortBy == null) ? "id" : sortBy.toLowerCase();
        String dir = (sortDir == null) ? "asc" : sortDir.toLowerCase();

        Sort sort;
        if ("name".equals(normalized)) {
            sort = Sort.by("name");
        } else if ("price".equals(normalized)) {
            sort = Sort.by("price");
        } else {
            sort = Sort.by("id");
        }

        if ("desc".equals(dir)) {
            sort = sort.descending();
        } else {
            sort = sort.ascending();
        }

        return PageRequest.of(page, size, sort);
    }

    private ProductsResponse toProductsResponse(Page<Product> productPage) {
        List<ProductDTO> productList = productPage.getContent().stream()
                .map(this::convertToDTO)
                .toList();
        ProductsResponse response = new ProductsResponse();
        response.setProducts(productList);
        response.setPagination(new PaginationInfo(
                productPage.getNumber(),
                productPage.getSize(),
                productPage.getTotalElements(),
                productPage.getTotalPages(),
                productPage.isFirst(),
                productPage.isLast()));
        return response;
    }

    private Pageable createPageable(int page, int size) {
        if (page < 0) {
            throw new RuntimeException("page phải lớn hơn hoặc bằng 0");
        }

        if (size <= 0) {
            throw new RuntimeException("size phải lớn hơn 0");
        }

        return PageRequest.of(page, size, Sort.by("id").ascending());
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

    @Transactional
    @Override
    public ProductDTO addProductToCategory(Long productId, Long categoryId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        Category category = getActiveCategory(categoryId);

        if (product.getCategory().getId().equals(category.getId())) {
            return convertToDTO(product);
        }

        product.setCategory(category);

        product.getAttributeValues()
                .removeIf(value -> !value.getAttribute().getCategory().getId().equals(category.getId()));

        Product updatedProduct = productRepository.save(product);
        return convertToDTO(updatedProduct);
    }

    @Transactional
    @Override
    public ProductDTO removeProductFromCategory(Long productId, Long categoryId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        if (!product.getCategory().getId().equals(categoryId)) {
            throw new RuntimeException("Sản phẩm không thuộc danh mục này");
        }

        ProductDTO deletedProduct = convertToDTO(product);

        product.setCategory(null);
        product.getAttributeValues().clear();
        productRepository.save(product);

        return deletedProduct;
    }

    private void replaceAttributeValues(
            Product product,
            List<ProductAttributeValueRequest> attributeRequests) {
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

        product.getAttributeValues().removeIf(value -> !requestedAttributeIds.contains(value.getAttribute().getId()));
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
                        value.getValue()))
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
                attributes);
    }
}
