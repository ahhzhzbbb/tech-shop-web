package com.example.shop.services.impls;

import com.example.shop.exceptions.ResourceNotFoundException;
import com.example.shop.models.Attribute;
import com.example.shop.models.Product;
import com.example.shop.models.ProductAttributeValue;
import com.example.shop.payloads.dto.ProductAttributeValueDTO;
import com.example.shop.payloads.request.ProductAttributeValueRequest;
import com.example.shop.payloads.response.ProductAttributeValuesResponse;
import com.example.shop.repositories.AttributeRepository;
import com.example.shop.repositories.ProductAttributeValueRepository;
import com.example.shop.repositories.ProductRepository;
import com.example.shop.services.ProductAttributeValueService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductAttributeValueServiceImpl implements ProductAttributeValueService {
    private final ProductRepository productRepository;
    private final AttributeRepository attributeRepository;
    private final ProductAttributeValueRepository productAttributeValueRepository;

    @Transactional
    @Override
    public ProductAttributeValuesResponse getProductAttributeValues(Long productId) {
        productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        List<ProductAttributeValueDTO> attributes = productAttributeValueRepository.findByProductId(productId)
                .stream()
                .map(this::convertToDTO)
                .toList();

        return new ProductAttributeValuesResponse(attributes);
    }

    @Transactional
    @Override
    public ProductAttributeValueDTO saveProductAttributeValue(
            Long productId,
            ProductAttributeValueRequest request
    ) {
        Product product = getProduct(productId);
        Attribute attribute = getAttribute(request.getAttributeId());
        validateAttributeBelongsToProductCategory(product, attribute);

        ProductAttributeValue productAttributeValue = productAttributeValueRepository
                .findByProductIdAndAttributeId(productId, attribute.getId())
                .orElseGet(ProductAttributeValue::new);

        productAttributeValue.setProduct(product);
        productAttributeValue.setAttribute(attribute);
        productAttributeValue.setValue(normalizeValue(request.getValue()));

        ProductAttributeValue savedValue = productAttributeValueRepository.save(productAttributeValue);
        return convertToDTO(savedValue);
    }

    @Transactional
    @Override
    public ProductAttributeValuesResponse replaceProductAttributeValues(
            Long productId,
            List<ProductAttributeValueRequest> requests
    ) {
        Product product = getProduct(productId);
        product.getAttributeValues().removeIf(value -> {
            return requests == null
                    || requests.stream()
                    .noneMatch(request -> value.getAttribute().getId().equals(request.getAttributeId()));
        });

        Set<Long> requestAttributeIds = new HashSet<>();
        if (requests != null) {
            for (ProductAttributeValueRequest request : requests) {
                Attribute attribute = getAttribute(request.getAttributeId());
                validateAttributeBelongsToProductCategory(product, attribute);

                if (!requestAttributeIds.add(attribute.getId())) {
                    throw new RuntimeException("Danh sách thuộc tính sản phẩm bị trùng");
                }

                ProductAttributeValue value = product.getAttributeValues()
                        .stream()
                        .filter(existingValue -> existingValue.getAttribute().getId().equals(attribute.getId()))
                        .findFirst()
                        .orElseGet(() -> {
                            ProductAttributeValue newValue = new ProductAttributeValue();
                            newValue.setProduct(product);
                            newValue.setAttribute(attribute);
                            product.getAttributeValues().add(newValue);
                            return newValue;
                        });

                value.setValue(normalizeValue(request.getValue()));
            }
        }

        Product savedProduct = productRepository.save(product);
        List<ProductAttributeValueDTO> attributes = savedProduct.getAttributeValues()
                .stream()
                .map(this::convertToDTO)
                .toList();

        return new ProductAttributeValuesResponse(attributes);
    }

    @Transactional
    @Override
    public void deleteProductAttributeValue(Long productId, Long attributeId) {
        ProductAttributeValue productAttributeValue = productAttributeValueRepository
                .findByProductIdAndAttributeId(productId, attributeId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductAttributeValue", "attributeId", attributeId));

        productAttributeValueRepository.delete(productAttributeValue);
    }

    private Product getProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
    }

    private Attribute getAttribute(Long attributeId) {
        if (attributeId == null) {
            throw new RuntimeException("attributeId không được để trống");
        }

        return attributeRepository.findById(attributeId)
                .orElseThrow(() -> new ResourceNotFoundException("Attribute", "id", attributeId));
    }

    private void validateAttributeBelongsToProductCategory(Product product, Attribute attribute) {
        if (!product.getCategory().getId().equals(attribute.getCategory().getId())) {
            throw new RuntimeException("Thuộc tính không thuộc danh mục của sản phẩm");
        }
    }

    private String normalizeValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new RuntimeException("Giá trị thuộc tính không được để trống");
        }

        return value.trim();
    }

    private ProductAttributeValueDTO convertToDTO(ProductAttributeValue value) {
        return new ProductAttributeValueDTO(
                value.getId(),
                value.getAttribute().getId(),
                value.getAttribute().getName(),
                value.getValue()
        );
    }
}
