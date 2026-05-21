package com.example.shop.payloads.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttributeRequest {
    private String name;
    private Long categoryId;
}
