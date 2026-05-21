package com.example.shop.payloads.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductAttributeValueDTO {
    private Long id;
    private Long attributeId;
    private String attributeName;
    private String value;
}
