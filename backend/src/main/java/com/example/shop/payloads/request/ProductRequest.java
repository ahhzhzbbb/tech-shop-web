package com.example.shop.payloads.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequest {
    private String name;
    private String description;
    private Double price;
    private Integer quantity;
    private String imageUrl;
    private String status;
}
