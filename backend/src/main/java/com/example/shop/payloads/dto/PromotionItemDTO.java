package com.example.shop.payloads.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PromotionItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private Integer discountPercent;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
