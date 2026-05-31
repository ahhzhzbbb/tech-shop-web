package com.example.shop.payloads.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PromotionItemRequest {
    private Long productId;
    private Integer discountPercent;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
