package com.example.shop.payloads.response;

import com.example.shop.payloads.dto.CartItemDTO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {

    private Long cartId;

    private Long userId;

    private List<CartItemDTO> items;

    private Integer totalItems;

    private Double totalAmount;
}
