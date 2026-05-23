package com.example.shop.payloads.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductAttributeValueRequest {
    private Long attributeId;
    private String value;
}
