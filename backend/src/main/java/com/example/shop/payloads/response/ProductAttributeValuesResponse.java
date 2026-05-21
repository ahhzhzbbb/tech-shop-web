package com.example.shop.payloads.response;

import com.example.shop.payloads.dto.ProductAttributeValueDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductAttributeValuesResponse {
    private List<ProductAttributeValueDTO> attributes;
}
