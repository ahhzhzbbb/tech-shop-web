package com.example.shop.payloads.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class OrderRequest {
    private LocalDate orderDate;
    private Double totalAmount;
    private String status;
    private String notes;
    private Long userId;
    private List<OrderItemRequest> orderItems;
}
