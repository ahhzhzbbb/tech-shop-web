package com.example.shop.payloads.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemRequest {
    private Integer quantity;
    private Double price;
    private Long productId;
}
