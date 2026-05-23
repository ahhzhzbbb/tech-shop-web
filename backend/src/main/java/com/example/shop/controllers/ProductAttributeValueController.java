package com.example.shop.controllers;

import com.example.shop.payloads.dto.ProductAttributeValueDTO;
import com.example.shop.payloads.request.ProductAttributeValueRequest;
import com.example.shop.payloads.response.ProductAttributeValuesResponse;
import com.example.shop.services.ProductAttributeValueService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductAttributeValueController {
    private final ProductAttributeValueService productAttributeValueService;

    @PermitAll
    @GetMapping("/product/{productId}/attribute-values")
    public ResponseEntity<ProductAttributeValuesResponse> getProductAttributeValues(
            @PathVariable Long productId
    ) {
        ProductAttributeValuesResponse response =
                productAttributeValueService.getProductAttributeValues(productId);
        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/product/{productId}/attribute-value")
    public ResponseEntity<ProductAttributeValueDTO> saveProductAttributeValue(
            @PathVariable Long productId,
            @RequestBody ProductAttributeValueRequest request
    ) {
        ProductAttributeValueDTO response =
                productAttributeValueService.saveProductAttributeValue(productId, request);
        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/product/{productId}/attribute-values")
    public ResponseEntity<ProductAttributeValuesResponse> replaceProductAttributeValues(
            @PathVariable Long productId,
            @RequestBody List<ProductAttributeValueRequest> requests
    ) {
        ProductAttributeValuesResponse response =
                productAttributeValueService.replaceProductAttributeValues(productId, requests);
        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/product/{productId}/attribute/{attributeId}")
    public ResponseEntity<String> deleteProductAttributeValue(
            @PathVariable Long productId,
            @PathVariable Long attributeId
    ) {
        productAttributeValueService.deleteProductAttributeValue(productId, attributeId);
        return ResponseEntity.ok("Delete product attribute value successfully");
    }
}
