package com.example.shop.payloads.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDTO {

    private Long id;

    private Long productId;

    private String productName;

    private String imageUrl;

    private Long price;

    private Integer quantity;

    private Long subTotal;
}
