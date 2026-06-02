package com.example.shop.payloads.dto;

import com.example.shop.models.PaymentMethod;
import com.example.shop.models.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDTO {
    private Long id;
    private String transactionId;
    private BigDecimal amount;
    private PaymentMethod method;
    private PaymentStatus status;
    private String responseCode;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
    private Long orderId;
}
