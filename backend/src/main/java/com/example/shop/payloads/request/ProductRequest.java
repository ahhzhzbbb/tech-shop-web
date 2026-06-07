package com.example.shop.payloads.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProductRequest {
    private String name;
    private String description;
    private Long price;
    private Integer quantity;
    private String imageUrl;
    private String status;
    private Double averageScore;
    private String brandName;
    private Long categoryId;
    private List<ProductAttributeValueRequest> attributeValues;
}
