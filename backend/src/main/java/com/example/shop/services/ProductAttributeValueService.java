package com.example.shop.services;

import com.example.shop.payloads.dto.ProductAttributeValueDTO;
import com.example.shop.payloads.request.ProductAttributeValueRequest;
import com.example.shop.payloads.response.ProductAttributeValuesResponse;

import java.util.List;

public interface ProductAttributeValueService {
    ProductAttributeValuesResponse getProductAttributeValues(Long productId);

    ProductAttributeValueDTO saveProductAttributeValue(
            Long productId,
            ProductAttributeValueRequest request
    );

    ProductAttributeValuesResponse replaceProductAttributeValues(
            Long productId,
            List<ProductAttributeValueRequest> requests
    );

    void deleteProductAttributeValue(Long productId, Long attributeId);
}
