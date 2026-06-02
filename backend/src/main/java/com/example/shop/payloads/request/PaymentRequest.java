package com.example.shop.payloads.request;

import com.example.shop.models.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private Long orderId;
    private PaymentMethod paymentMethod;
    private String bankCode; // For VNPay, optional (e.g., "NCB", "AGRIBANK", etc.)
}
