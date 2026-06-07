package com.example.shop.payloads.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private Long price;
    private Integer quantity;
    private String imageUrl;
    private String status;
    private Double averageScore;
    private String brandName;
    private Long categoryId;
    private String categoryName;
    private List<ProductAttributeValueDTO> attributes;
}
