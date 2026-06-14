package com.example.shop.payloads.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class OrderRequest {
    private LocalDate orderDate;
    private Long totalAmount;
    private String status;
    private String notes;
    private String recipientName;
    private String recipientPhone;
    private String shippingAddress;
    private Long userId;
    private List<OrderItemRequest> orderItems;
}
