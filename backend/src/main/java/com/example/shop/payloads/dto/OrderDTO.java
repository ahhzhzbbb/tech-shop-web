package com.example.shop.payloads.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private Long id;
    private LocalDate orderDate;
    private Long totalAmount;
    private String status;
    private String notes;
    private String recipientName;
    private String recipientPhone;
    private String shippingAddress;
    private Long userId;
    private List<OrderItemDTO> orderItems;
}
